import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Common } from '../common';
import { Api } from '../api';

type PersonType = 'prospects' | 'clients' | 'ex-clients';

interface Person {
  id: string;
  name: string;
  phone: string;
  gender: string;
  email: string;
  avatar: string;
  type: PersonType;
  steps: boolean[];
}

interface Step {
  id: any;
  title: string;
  text: string;
  items: string[] | null;
  itemIds: any[];
}

// Tab -> status value used by the API
const STATUS: { [k in PersonType]: string } = { 'prospects': 'prospect', 'clients': 'client', 'ex-clients': 'ex_client' };

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.page.html',
  styleUrls: ['./prospects.page.scss'],
  standalone: false,
})
export class ProspectsPage implements OnInit, OnDestroy {

  private _unsubscribeAll = new Subject<any>();
  private searchTimer: any;

  view: 'list' | 'add' | 'followup' = 'list';
  nav = 'profile';

  // list state
  activeTab: PersonType = 'prospects';
  searchQuery = '';
  genderFilter: 'All' | 'Female' | 'Male' = 'All';
  filteredClients: Person[] = [];
  private lists: { [k in PersonType]: Person[] } = { 'prospects': [], 'clients': [], 'ex-clients': [] };
  private counts: { [k in PersonType]: number } = { 'prospects': 0, 'clients': 0, 'ex-clients': 0 };

  // add state
  readonly coachLink = 'hyynd.app/priya-sharma';
  pastedLink = '';
  copied = false;
  linkError = false;

  // follow-up state
  selected?: Person;
  steps: Step[] = [];

  constructor(
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController,
    private commonService: Common,
    private apiService: Api
  ) {}

  ngOnInit(): void { this.follow_up_step_list(); }

  ionViewWillEnter(): void { this.loadAll(true); }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // One request with loader + error toast, so each API below stays short
  private run(req: Observable<any>, ok: (r: any) => void, loader = true, fail?: () => void) {
    if (loader) { this.commonService.presentLoading(); }
    req.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (r: any) => { console.log(r); if (loader) { this.commonService.dismissLoading(); } ok(r); },
      error: (e: any) => {
        console.log(e);
        if (loader) { this.commonService.dismissLoading(); }
        fail?.();
        this.commonService.showToastMessage(e, 'toast-error', '', 4000);
      }
    });
  }

  private toast(msg: string) { this.commonService.showToastMessage(msg, 'toast-success', '', 2000); }

  private typeOf(s: string): PersonType {
    return s === 'client' ? 'clients' : s === 'ex_client' ? 'ex-clients' : 'prospects';
  }

  /* ---------- follow_up_step_list ---------- */
  private follow_up_step_list() {
    this.run(this.apiService.follow_up_step_list({}), r => {
      this.steps = (r?.data || []).map((s: any) => ({
        id: s.id,
        title: s.name ?? '',
        text: s.description ?? '',
        items: s.items?.length ? s.items.map((i: any) => i.text) : null,
        itemIds: (s.items || []).map((i: any) => i.id)
      }));
    }, false);
  }

  /* ---------- prospect_list ---------- */
  private mapPerson(d: any, type: PersonType): Person {
    const name = d.full_name ?? '';
    const g = String(d.gender ?? '');
    return {
      id: String(d.id),
      name,
      phone: d.mobile_number ?? '',
      gender: g ? g[0].toUpperCase() + g.slice(1).toLowerCase() : 'Not set',
      email: d.email ?? '',
      avatar: d.profile_picture ?? `https://ui-avatars.com/api/?background=00c07f&color=fff&size=200&name=${encodeURIComponent(name)}`,
      type,
      steps: this.steps.map(() => false)
    };
  }

  // One call: the active tab's list, and the counts of all 3 tabs
  private loadAll(loader: boolean) {
    this.run(this.apiService.prospect_list({
      status: STATUS[this.activeTab], search: this.searchQuery.trim(), page: 1, page_size: 20
    }), (r: any) => {
      const c = r?.counts || {};
      this.counts = { 'prospects': c.prospect ?? 0, 'clients': c.client ?? 0, 'ex-clients': c.ex_client ?? 0 };
      this.lists[this.activeTab] = (r?.data || []).map((d: any) => this.mapPerson(d, this.activeTab));
      this.applyFilters();
    }, loader);
  }

  /* ---------- LIST (HTML names unchanged) ---------- */
  // Search box: reloads from the API after a short pause
  filterClients(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadAll(false), 400);
  }

  private applyFilters(): void {
    this.filteredClients = this.lists[this.activeTab].filter(p => this.genderFilter === 'All' || p.gender === this.genderFilter);
  }

  setTab(tab: PersonType): void { this.activeTab = tab; this.loadAll(true); }
  getCount(t: PersonType): number { return this.counts[t]; }

  async openFilter(): Promise<void> {
    const sheet = await this.actionSheet.create({
      header: 'Filter by gender',
      buttons: [
        ...(['All', 'Female', 'Male'] as const).map(g => ({
          text: g,
          role: this.genderFilter === g ? 'selected' : undefined,
          handler: () => { this.genderFilter = g; this.applyFilters(); }
        })),
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  /* ---------- prospect_details ---------- */
  openPerson(p: Person): void { this.openDetails(p.id, p); }   // every card opens the follow-up

  private openDetails(id: string, base?: Person) {
    this.run(this.apiService.prospect_details({ prospect_id: id }), r => {
      const d = r?.data ?? r;
      const p = base ?? this.mapPerson(d, this.typeOf(d.status));
      const done = new Set<string>(
        (d.follow_up || []).filter((s: any) => s.is_completed).map((s: any) => String(s.id))
      );
      p.steps = this.steps.map(s => done.has(String(s.id)));
      this.selected = p;
      this.view = 'followup';
    });
  }

  /* ---------- ADD ---------- */
  async copyLink(): Promise<void> {
    const full = `https://${this.coachLink}`;
    try {
      await navigator.clipboard.writeText(full);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1800);
      this.toast('Link copied');
    } catch {
      this.commonService.showToastMessage('Could not copy link', 'toast-error', '', 2000);
    }
  }

  shareWhatsApp(): void {
    const msg = `Hi! Book your first session with me here: https://${this.coachLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      this.pastedLink = (await navigator.clipboard.readText()).trim();
    } catch {
      this.commonService.showToastMessage('Clipboard unavailable. Type or long-press to paste.', 'toast-error', '', 2500);
      return;
    }
    this.submitLink();
  }

  /* ---------- check_share_link, then add_prospect_by_link ---------- */
  submitLink(): void {
    const link = this.pastedLink.trim();
    if (!link) { this.linkError = true; return; }

    this.run(this.apiService.check_share_link({ link }), () => {
      this.run(this.apiService.add_prospect_by_link({ link }), r => {
        this.toast(r?.message || 'Prospect added');
        this.pastedLink = '';
        const id = r?.data?.id ?? r?.data?.prospect_id ?? r?.prospect_id;
        if (id) { this.openDetails(String(id)); }
        else { this.view = 'list'; this.loadAll(true); }
      }, true, () => (this.linkError = true));
    }, true, () => (this.linkError = true));
  }

  /* ---------- update_prospect_step ---------- */
  toggleStep(i: number): void {
    const p = this.selected, s = this.steps[i];
    if (!p || !s) { return; }
    const done = !p.steps[i];

    this.run(this.apiService.update_prospect_step({
      prospect_id: p.id, step_id: s.id, is_completed: done,
      checked_item_ids: done ? s.itemIds : [], note: ''
    }), () => {
      p.steps[i] = done;
      if (p.type === 'prospects' && p.steps.every(x => x)) { this.changeStatus(p, 'clients'); }
      else if (p.type === 'clients' && !done) { this.changeStatus(p, 'prospects'); }
    }, false);
  }

  /* ---------- change_prospect_status ---------- */
  changeStatus(p: Person, tab: PersonType): void {
    this.run(this.apiService.change_prospect_status({ prospect_id: p.id, status: STATUS[tab] }), () => {
      p.type = tab;
      if (tab === 'clients') { this.toast(`${p.name} is now a client 🎉`); }
    }, false);
  }

  /* ---------- update_prospect (no screen yet: call it from an edit form) ---------- */
  updateProspect(p: Person, d: { full_name: string; mobile_number: string; email: string; gender: string; package_name: string; package_price: number }): void {
    this.run(this.apiService.update_prospect({ prospect_id: p.id, ...d }), r => {
      this.toast(r?.message || 'Prospect updated');
      this.loadAll(false);
    });
  }

  /* ---------- delete_prospect (no button yet: call it from a menu) ---------- */
  async deleteProspect(p: Person): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Prospect',
      message: `Are you sure you want to delete "${p.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete', role: 'destructive', handler: () => {
            this.run(this.apiService.delete_prospect({ prospect_id: p.id }), r => {
              this.toast(r?.message || 'Prospect deleted');
              this.closeFollowUp();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  closeFollowUp(): void {
    this.selected = undefined;
    this.view = 'list';
    this.loadAll(false);
  }
}
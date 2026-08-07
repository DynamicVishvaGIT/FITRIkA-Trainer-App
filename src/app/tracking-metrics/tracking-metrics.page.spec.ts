import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingMetricsPage } from './tracking-metrics.page';

describe('TrackingMetricsPage', () => {
  let component: TrackingMetricsPage;
  let fixture: ComponentFixture<TrackingMetricsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingMetricsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

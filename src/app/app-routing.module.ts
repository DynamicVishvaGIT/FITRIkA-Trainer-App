import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('./otp-verification/otp-verification.module').then( m => m.OtpVerificationPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'workout-plans',
    loadChildren: () => import('./workout-plans/workout-plans.module').then( m => m.WorkoutPlansPageModule)
  },

  {
    path: 'workout-details',
    loadChildren: () => import('./workout-details/workout-details.module').then( m => m.WorkoutDetailsPageModule)
  },
  {
    path: 'add-workout',
    loadChildren: () => import('./add-workout/add-workout.module').then( m => m.AddWorkoutPageModule)
  },
  {
    path: 'add-day-plan',
    loadChildren: () => import('./add-day-plan/add-day-plan.module').then( m => m.AddDayPlanPageModule)
  },
  {
    path: 'workout-plan-detail',
    loadChildren: () => import('./workout-plan-detail/workout-plan-detail.module').then( m => m.WorkoutPlanDetailPageModule)
  },
  {
    path: 'diet-plan',
    loadChildren: () => import('./diet-plan/diet-plan.module').then( m => m.DietPlanPageModule)
  },
  {
    path: 'add-diet-plan',
    loadChildren: () => import('./add-diet-plan/add-diet-plan.module').then( m => m.AddDietPlanPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'diet-plan-details',
    loadChildren: () => import('./diet-plan-details/diet-plan-details.module').then( m => m.DietPlanDetailsPageModule)
  },
  {
    path: 'add-diet-plan-details',
    loadChildren: () => import('./add-diet-plan-details/add-diet-plan-details.module').then( m => m.AddDietPlanDetailsPageModule)
  },
  
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then( m => m.ClientsPageModule)
  },
  {
    path: 'workout-log',
    loadChildren: () => import('./workout-log/workout-log.module').then( m => m.WorkoutLogPageModule)
  },
  {
    path: 'diet-log',
    loadChildren: () => import('./diet-log/diet-log.module').then( m => m.DietLogPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'prospects',
    loadChildren: () => import('./prospects/prospects.module').then( m => m.ProspectsPageModule)
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then( m => m.FormsPageModule)
  },
  {
    path: 'begin-assessment',
    loadChildren: () => import('./begin-assessment/begin-assessment.module').then( m => m.BeginAssessmentPageModule)
  },
  {
    path: 'package',
    loadChildren: () => import('./package/package.module').then( m => m.PackagePageModule)
  },
  {
    path: 'edit-package',
    loadChildren: () => import('./edit-package/edit-package.module').then( m => m.EditPackagePageModule)
  },
  {
    path: 'add-package',
    loadChildren: () => import('./add-package/add-package.module').then( m => m.AddPackagePageModule)
  },
  {
    path: 'slot',
    loadChildren: () => import('./slot/slot.module').then( m => m.SlotPageModule)
  },
  {
    path: 'edit-slot',
    loadChildren: () => import('./edit-slot/edit-slot.module').then( m => m.EditSlotPageModule)
  },
  {
    path: 'add-workout-log',
    loadChildren: () => import('./add-workout-log/add-workout-log.module').then( m => m.AddWorkoutLogPageModule)
  },
  {
    path: 'add-diet-log',
    loadChildren: () => import('./add-diet-log/add-diet-log.module').then( m => m.AddDietLogPageModule)
  },
  {
    path: 'add-slot',
    loadChildren: () => import('./add-slot/add-slot.module').then( m => m.AddSlotPageModule)
  },
  {
    path: 'add-field',
    loadChildren: () => import('./add-field/add-field.module').then( m => m.AddFieldPageModule)
  },
  {
    path: 'submit-form',
    loadChildren: () => import('./submit-form/submit-form.module').then( m => m.SubmitFormPageModule)
  },
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

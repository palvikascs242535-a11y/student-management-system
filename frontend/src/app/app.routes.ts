import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./login/login').then(m => m.LoginComponent)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup').then(m => m.SignupComponent)
  },

  {
    path: 'student',
    loadComponent: () =>
      import('./student/student').then(m => m.StudentComponent),
    canActivate: [authGuard]   // 🔐 protected route
  },

  {
    path: '**',
    redirectTo: ''
  }
];
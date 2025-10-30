import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/tenant/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'tenant',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'admin',
        component: PlaceholderComponent,
        canActivate: [adminGuard]
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

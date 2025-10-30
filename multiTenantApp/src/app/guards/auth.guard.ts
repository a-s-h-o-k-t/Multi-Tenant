import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

const isUserAuthenticated = (authService: AuthService): boolean => 
  authService.isAuthenticated() && authService.isSessionValid();

const redirectToLogin = (router: Router): boolean => {
  router.navigate(['/login']);
  return false;
};

const redirectToDashboard = (router: Router): boolean => {
  router.navigate(['/tenant/dashboard']);
  return false;
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return isUserAuthenticated(authService) || redirectToLogin(router);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!isUserAuthenticated(authService)) return redirectToLogin(router);
  
  return authService.isAdmin() || redirectToDashboard(router);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return !isUserAuthenticated(authService) || redirectToDashboard(router);
};

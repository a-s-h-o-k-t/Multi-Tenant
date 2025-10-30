import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, tap, takeUntil, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { LoginCredentials } from '../../models/auth.interface';
import { BaseComponent } from '../../../base';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent extends BaseComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  loginForm!: FormGroup;

  // Demo credentials for easy testing
  readonly demoCredentials = [
    { tenant: 'Tenant 1', username: 'admin1', password: 'admin123', role: 'Admin' },
    { tenant: 'Tenant 1', username: 'user1', password: 'user123', role: 'User' },
    { tenant: 'Tenant 2', username: 'admin2', password: 'admin123', role: 'Admin' },
    { tenant: 'Tenant 2', username: 'user2', password: 'user123', role: 'User' }
  ];

  constructor() {
    super();
    this.createForm();
  }

  override init(): Observable<unknown> {
    return of(null);
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    
    if (this.isLoading()) return;

    if (this.loginForm.valid) {
      this.performLogin();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private performLogin(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const detectedTenant = this.tenantService.detectTenantFromSubdomain();
    console.log('Detected tenant from subdomain:', detectedTenant);
    
    const credentials: LoginCredentials = {
      ...this.loginForm.value,
      tenantId: detectedTenant
    };

    this.authService.login(credentials)
      .pipe(
        tap((response) => {
          if (response.success && response.user) {
            this.router.navigate(['/tenant/dashboard']);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('❌ Login error:', error);
          this.errorMessage.set(error.message || 'An error occurred during login');
          return of(null);
        }),
        tap(() => this.isLoading.set(false)),
        takeUntil(this.dispose)
      )
      .subscribe();
  }

  // Simple validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';
    
    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    
    return 'Invalid input';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  fillDemoCredentials(demo: any): void {
    this.loginForm.patchValue({
      username: demo.username,
      password: demo.password,
    });
  }

  clearForm(): void {
    this.loginForm.reset();
    this.errorMessage.set(null);
  }
}

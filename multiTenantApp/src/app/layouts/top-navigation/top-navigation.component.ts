import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { TenantService } from '../../services/tenant.service';
import { AuthService } from '../../services/auth.service';
import { TenantConfig } from '../../models/tenant.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss'],
  standalone: false
})
export class TopNavigationComponent {
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  readonly mobileMenuOpen = signal(false);
  readonly isAdmin = signal(false);

  readonly currentTenant = toSignal(this.tenantService.currentTenant$, {
    initialValue: null,
  });

  readonly currentUser = this.authService.currentUser;

  constructor() {
    effect(
      () => {
        this.isAdmin.set(this.authService.isAdmin());
      },
      { allowSignalWrites: true }
    );
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}

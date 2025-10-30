import { Component, effect, inject, signal } from '@angular/core';
import { TenantService } from '../../services/tenant.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  standalone: false,
})
export class SideNavigationComponent {
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  readonly sidebarOpen = signal(true);

  readonly currentTenant = toSignal(this.tenantService.currentTenant$, {
    initialValue: null,
  });

  readonly currentUser = this.authService.currentUser;
  readonly isAdmin = signal(false);

  constructor() {
    effect(
      () => {
        this.isAdmin.set(this.authService.isAdmin());
      },
      { allowSignalWrites: true }
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}

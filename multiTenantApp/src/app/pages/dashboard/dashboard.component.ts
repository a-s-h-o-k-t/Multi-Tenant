import { Component, inject } from '@angular/core';
import { TenantService } from '../../services/tenant.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent {
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  readonly currentTenant = toSignal(this.tenantService.currentTenant$, {
    initialValue: null,
  });

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}

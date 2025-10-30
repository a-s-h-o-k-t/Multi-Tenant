import { Component, OnInit, inject } from '@angular/core';
import { TenantService } from '../../services/tenant.service';
import { TenantConfig } from '../../models/tenant.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '../../../base';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: false,
})
export class MainLayoutComponent extends BaseComponent implements OnInit {
  private tenantService = inject(TenantService);

  readonly currentTenant = toSignal(this.tenantService.currentTenant$, {
    initialValue: null,
  });

  override init(): Observable<unknown> {
    return this.tenantService.initializeTenant().pipe(
      catchError((error) => {
        console.error('Failed to initialize tenant:', error);
        this.hasInitialized = true;
        return of(null);
      }),
      takeUntil(this.dispose)
    );
  }
}

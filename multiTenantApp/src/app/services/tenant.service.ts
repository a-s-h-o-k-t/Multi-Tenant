import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TenantConfig, TenantConfigResponse } from '../models/tenant.interface';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<TenantConfig | null>(null);
  public currentTenant$ = this.currentTenantSubject.asObservable();

  private tenantConfigs: TenantConfigResponse = {};

  constructor(private http: HttpClient) {}

  loadTenantConfigs(): Observable<TenantConfigResponse> {
    return this.http
      .get<TenantConfigResponse>('/assets/tenant-config.json')
      .pipe(
        map((configs) => {
          this.tenantConfigs = configs;
          return configs;
        }),
        catchError((error) => {
          console.error('Failed to load tenant configurations:', error);
          return of({});
        })
      );
  }

  initializeTenant(): Observable<TenantConfig | null> {
    return this.loadTenantConfigs().pipe(
      map((configs) => {
        const detectedTenant = this.detectTenantFromSubdomain();
        const tenantConfig = configs[detectedTenant];

        if (tenantConfig) {
          this.setCurrentTenant(tenantConfig);
          this.applyTheme(tenantConfig.theme);
          return tenantConfig;
        }
        return null;
      })
    );
  }

  detectTenantFromSubdomain(): string {
    const hostname = window.location.hostname;

    // For development
    if (hostname === 'localhost') {
      // Default to tenant1 for development
      return 'tenant1';
    }

    // Extract subdomain from hostname
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const subdomain = parts[0];
      return subdomain;
    }

    // Default fallback
    return 'tenant1';
  }

  setCurrentTenant(tenant: TenantConfig): void {
    this.currentTenantSubject.next(tenant);
  }


  getCurrentTenant(): Observable<TenantConfig | null> {
    return this.currentTenant$;
  }

  private applyTheme(theme: any): void {
    const root = document.documentElement;

    Object.keys(theme).forEach((key) => {
      root.style.setProperty(`--color-${key}`, theme[key]);
    });
  }

  // For Testing
  switchTenant(tenantId: string): Observable<TenantConfig | null> {
    const tenantConfig = this.tenantConfigs[tenantId];
    if (tenantConfig) {
      this.setCurrentTenant(tenantConfig);
      this.applyTheme(tenantConfig.theme);
      return of(tenantConfig);
    }
    return of(null);
  }
}

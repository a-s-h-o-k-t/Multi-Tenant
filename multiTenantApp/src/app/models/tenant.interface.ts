export interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
}

export interface TenantBranding {
  companyName: string;
  supportEmail: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  logo: string;
  favicon: string;
  layout: 'side-navigation' | 'top-navigation';
  theme: TenantTheme;
  branding: TenantBranding;
}

export interface TenantConfigResponse {
  [key: string]: TenantConfig;
}

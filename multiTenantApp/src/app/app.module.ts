import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout Components
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SideNavigationComponent } from './layouts/side-navigation/side-navigation.component';
import { TopNavigationComponent } from './layouts/top-navigation/top-navigation.component';

// Page Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { LoginComponent } from './pages/login/login.component';

// Services
import { TenantService } from './services/tenant.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SideNavigationComponent,
    TopNavigationComponent,
    DashboardComponent,
    PlaceholderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    TenantService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

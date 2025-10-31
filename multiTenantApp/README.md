# Multi-Tenant Angular Application

A comprehensive multi-tenant Angular web application demonstrating authentication, role-based access control, dynamic theming, and tenant-specific branding. Built with Angular 19.2.0, TypeScript 5.7.2, and RxJS 7.8.0.

## 🏢 Multi-Tenant Features

### Supported Tenants
- **Tenant 1 Solutions Inc.**: Side navigation layout with blue theme
- **Tenant 2 Solutions Inc.**: Top navigation layout with purple theme

### Key Capabilities
- **Authentication & Session Management**: Secure login with localStorage persistence
- **Role-Based Access Control (RBAC)**: Admin and User roles with route guards
- **Dynamic Layout Switching**: Automatically loads different layouts based on tenant
- **Theme Management**: CSS custom properties for real-time theme switching
- **Subdomain Detection**: Tenant identification via subdomain
- **Branding Customization**: Unique logos, colors, and company information per tenant
- **Single Codebase**: One application serving multiple tenants

## 🚀 Setup Steps

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v19.2.8)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multiTenantApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Access the application**
   - Open browser to `http://localhost:4200`
   - Application defaults to Tenant 1 on localhost

### Development Setup

The application automatically detects tenant from subdomain:
- **localhost** → Defaults to `tenant1`
- **tenant1.localhost** → Loads Tenant 1 (Side Navigation)
- **tenant2.localhost** → Loads Tenant 2 (Top Navigation)

For production, configure DNS to point subdomains to your application.

## 🏗️ Architecture Overview

### Core Components

#### Services
- **AuthService**: Handles authentication, session management, and user roles
- **TenantService**: Manages tenant configuration, theme application, and subdomain detection
- **Route Guards**: Protects routes based on authentication and role permissions

#### Layouts
- **MainLayoutComponent**: Dynamic layout selector based on tenant configuration
- **SideNavigationComponent**: Side navigation layout for Tenant 1
- **TopNavigationComponent**: Top navigation layout for Tenant 2

#### Authentication
- **LoginComponent**: Reactive forms with validation and demo credentials
- **Route Guards**: `authGuard`, `adminGuard`, `guestGuard` for access control
- **Session Management**: 24-hour sessions with automatic restoration

#### Configuration
- **tenant-config.json**: Centralized tenant configuration including themes, logos, and branding
- **users.json**: Demo user credentials for testing authentication
- **CSS Custom Properties**: Dynamic theming system using CSS variables

### File Structure
```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts         # Route protection guards
│   ├── layouts/
│   │   ├── main-layout/          # Dynamic layout selector
│   │   ├── side-navigation/      # Tenant 1 layout
│   │   └── top-navigation/       # Tenant 2 layout
│   ├── models/
│   │   ├── auth.interface.ts     # Authentication interfaces
│   │   └── tenant.interface.ts   # Tenant interfaces
│   ├── pages/
│   │   ├── dashboard/            # Role-based dashboard
│   │   ├── login/                # Authentication page
│   │   └── placeholder/          # Admin placeholder page
│   └── services/
│       ├── auth.service.ts       # Authentication management
│       └── tenant.service.ts     # Tenant management
├── assets/
│   ├── tenant-config.json        # Tenant configuration
│   ├── users.json               # Demo user credentials
│   └── logos/                    # Tenant-specific logos
└── styles.scss                  # Global theming system
```

## 🎨 Theming System

The application uses CSS custom properties for dynamic theming:

```css
:root {
  --color-primary: #1976d2;
  --color-secondary: #424242;
  --color-accent: #ff4081;
  /* ... more theme variables */
}
```

Themes are applied dynamically by the TenantService, allowing real-time theme switching without page reload.

## 🏢 Tenant Configurations

### Tenant 1 Solutions Inc.
```json
{
  "id": "tenant1",
  "name": "Tenant 1 Solutions Inc.",
  "layout": "side-navigation",
  "logo": "/assets/logos/tenant1-logo.png",
  "theme": {
    "primary": "#1976d2",
    "secondary": "#424242",
    "accent": "#ff4081",
    "background": "#fafafa",
    "surface": "#ffffff",
    "text": "#212121",
    "textSecondary": "#757575"
  },
  "branding": {
    "companyName": "Tenant 1 Solutions Inc.",
    "tagline": "Enterprise Solutions Provider"
  }
}
```

### Tenant 2 Solutions Inc.
```json
{
  "id": "tenant2",
  "name": "Tenant 2 Solutions Inc.",
  "layout": "top-navigation",
  "logo": "/assets/logos/tenant2-logo.png",
  "theme": {
    "primary": "#7b1fa2",
    "secondary": "#424242",
    "accent": "#00bcd4",
    "background": "#f3e5f5",
    "surface": "#ffffff",
    "text": "#212121",
    "textSecondary": "#757575"
  },
  "branding": {
    "companyName": "Tenant 2 Solutions Inc.",
    "tagline": "Creative Studio & Design"
  }
}
```

## 🔐 Test Credentials

### Tenant 1 Users
| Role  | Username | Password  | Access Level |
|-------|----------|-----------|--------------|
| Admin | admin1   | admin123  | Full access to dashboard + admin panel |
| User  | user1    | user123   | Dashboard access only |

### Tenant 2 Users
| Role  | Username | Password  | Access Level |
|-------|----------|-----------|--------------|
| Admin | admin2   | admin123  | Full access to dashboard + admin panel |
| User  | user2    | user123   | Dashboard access only |

### Authentication Features
- **Session Duration**: 24 hours with automatic expiration
- **Session Persistence**: Survives browser refresh and tab closure
- **Role-Based Access**: Different UI elements based on user role
- **Tenant Isolation**: Users can only authenticate within their tenant
- **Route Protection**: Guards prevent unauthorized access

### Testing Authentication
1. Navigate to `http://localhost:4200/login`
2. Use any of the test credentials above
3. Click demo credential cards for quick form filling
4. Observe different dashboard content based on role:
   - **Users**: See "My Profile" card only
   - **Admins**: See both "My Profile" and "Admin Panel" cards

## 🚀 Deployment to Firebase Hosting

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created with multiple hosting sites
- Domain configured (optional)

### Firebase Project Setup

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase Hosting** (if not already done)
   ```bash
   firebase init hosting
   ```

### Configuration Files

Your project should have these Firebase configuration files:

**`.firebaserc`**
```json
{
  "projects": {
    "default": "tenant-d87e3"
  },
  "targets": {
    "tenant-d87e3": {
      "hosting": {
        "tenant1": ["tenant1-attech"],
        "tenant2": ["tenant2-attech"]
      }
    }
  }
}
```

**`firebase.json`**
```json
{
  "hosting": [
    {
      "target": "tenant1",
      "public": "dist/multi-tenant-app/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    },
    {
      "target": "tenant2", 
      "public": "dist/multi-tenant-app/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  ]
}
```

### Deployment Steps

1. **Build the Application**
   ```bash
   ng build --configuration production
   ```

2. **Deploy to Both Sites**
   ```bash
   firebase deploy --only hosting:tenant1,hosting:tenant2
   ```

3. **Deploy to Individual Sites** (Optional)
   ```bash
   # Deploy only to tenant1
   firebase deploy --only hosting:tenant1
   
   # Deploy only to tenant2
   firebase deploy --only hosting:tenant2
   ```

4. **Deploy All Hosting Targets**
   ```bash
   firebase deploy --only hosting
   ```

### Post-Deployment

After successful deployment, your sites will be available at:
- **Tenant 1**: `https://tenant1-attech.web.app`
- **Tenant 2**: `https://tenant2-attech.web.app`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

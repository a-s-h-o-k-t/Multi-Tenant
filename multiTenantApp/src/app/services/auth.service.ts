import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  User,
  LoginCredentials,
  LoginResponse,
  AuthSession,
  UsersDatabase,
} from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<User | null>(null);

  private readonly SESSION_KEY = 'auth_session';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initializeSession();
  }

  private clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private initializeSession(): void {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);

        // Check if session is still valid
        if (new Date(session.expiresAt) > new Date()) {
          this.setCurrentUser(session.user);
          console.log('Session restored for user:', session.user.username);
        } else {
          console.log('Session expired, clearing...');
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      this.clearSession();
    }
  }

  isSessionValid(): boolean {
    const session = this.getSession();
    if (!session) return false;

    return new Date(session.expiresAt) > new Date();
  }

  getSession(): AuthSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.loadUsers().pipe(
      map((usersDb) => {
        const tenantIds = credentials.tenantId
          ? [credentials.tenantId]
          : Object.keys(usersDb);

        for (const tenantId of tenantIds) {
          const users = usersDb[tenantId] || [];
          const user = users.find(
            (u) =>
              u.username === credentials.username &&
              u.password === credentials.password &&
              u.isActive
          );

          if (user) {
            const authenticatedUser: User = {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              tenantId: user.tenantId,
              firstName: user.firstName,
              lastName: user.lastName,
              isActive: user.isActive,
              createdAt: user.createdAt,
              lastLogin: new Date().toISOString(),
            };

            const session: AuthSession = {
              user: authenticatedUser,
              loginTime: new Date().toISOString(),
              expiresAt: new Date(
                Date.now() + this.SESSION_DURATION
              ).toISOString(),
            };

            // Save session
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            this.setCurrentUser(authenticatedUser);

            console.log(
              'Login successful for:',
              authenticatedUser.username,
              'Role:',
              authenticatedUser.role
            );

            return {
              success: true,
              user: authenticatedUser,
              message: 'Login successful',
            };
          } else {
            return {
              success: false,
              message: 'Please check your credentials related to tenant',
            };
          }
        }

        return {
          success: false,
          message: 'Invalid username or password',
        };
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of({
          success: false,
          message: 'Login service unavailable',
        });
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  private loadUsers(): Observable<UsersDatabase> {
    return this.http.get<UsersDatabase>('/assets/users.json').pipe(
      catchError((error) => {
        console.error('Failed to load users:', error);
        return of({});
      })
    );
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }
}

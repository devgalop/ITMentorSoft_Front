import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { JwtService } from './jwt.service';
import { AuthUser, LoginCredentials, LoginResponse } from './auth.types';
import { environment } from '@env/environment';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  private readonly _isAuthenticated = computed(() => this._token() !== null);

  private readonly _user = computed<AuthUser | null>(() => {
    const token = this._token();
    return token ? this.jwtService.decode(token) : null;
  });

  readonly token = this._token.asReadonly();
  readonly isAuthenticated = this._isAuthenticated;
  readonly user = this._user;
  readonly role = computed<AuthUser['role'] | null>(() => this._user()?.role ?? null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/users/sessions`, credentials),
      );
      this._token.set(response.token);
      sessionStorage.setItem(TOKEN_KEY, response.token);
    } catch (error) {
      throw this.mapHttpError(error);
    }
  }

  logout(): void {
    this._token.set(null);
    sessionStorage.removeItem(TOKEN_KEY);
    this.clearAllCookies();
    this.router.navigate(['/login']);
  }

  private clearAllCookies(): void {
    const cookies = document.cookie.split(';');
    const paths = ['/', '/users', '/api'];
    const domains = ['', `.${location.hostname}`, location.hostname];

    for (const cookie of cookies) {
      const name = cookie.split('=')[0]?.trim();
      if (!name) continue;

      for (const path of paths) {
        for (const domain of domains) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
        }
      }
    }
  }

  private mapHttpError(error: unknown): Error {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return new Error('Sin conexión al servidor');
        case 401:
          return new Error('Credenciales inválidas');
        case 403:
          return new Error('Acceso denegado');
        default:
          return new Error('Error en el servidor, intentá más tarde');
      }
    }
    return error instanceof Error ? error : new Error('Error desconocido');
  }
}
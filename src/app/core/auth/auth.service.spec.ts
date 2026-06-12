import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginResponse } from './auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const apiUrl = '';
  const sessionUrl = `${apiUrl}/users/sessions`;

  const mockResponse: LoginResponse = {
    is_successful: true,
    token: 'test-token-123',
    expiration_time: 1700000000,
    refresh_token: 'refresh-token-456',
  };

  const validCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('login() sends POST to /users/sessions with correct payload', async () => {
    const loginPromise = service.login(validCredentials);

    const req = httpMock.expectOne(sessionUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(validCredentials);
    req.flush(mockResponse);

    await loginPromise;
    expect(sessionStorage.getItem('auth_token')).toBe('test-token-123');
  });

  it('login() stores token in sessionStorage and updates isAuthenticated on success', async () => {
    expect(service.isAuthenticated()).toBe(false);

    const loginPromise = service.login(validCredentials);
    const req = httpMock.expectOne(sessionUrl);
    req.flush(mockResponse);

    await loginPromise;
    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('test-token-123');
  });

  it('login() throws error with mapped message on 401', async () => {
    const loginPromise = service.login(validCredentials);

    const req = httpMock.expectOne(sessionUrl);
    req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    await expect(loginPromise).rejects.toThrow('Credenciales inválidas');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('login() throws connection error message on network error', async () => {
    const loginPromise = service.login(validCredentials);

    const req = httpMock.expectOne(sessionUrl);
    req.error(new ProgressEvent('Network error'));

    await expect(loginPromise).rejects.toThrow('Sin conexión al servidor');
  });

  it('logout() clears sessionStorage and resets signals', async () => {
    // First login
    const loginPromise = service.login(validCredentials);
    const req = httpMock.expectOne(sessionUrl);
    req.flush(mockResponse);
    await loginPromise;

    expect(service.isAuthenticated()).toBe(true);
    expect(sessionStorage.getItem('auth_token')).toBe('test-token-123');

    // Then logout
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

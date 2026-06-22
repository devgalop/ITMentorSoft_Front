import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { LoginResponse } from './auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const apiUrl = '';
  const sessionUrl = `${apiUrl}/users/sessions`;

  const VALID_STUDENT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJlaWRlcl90ZXN0Iiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjE3ODIxMDY5OTV9.C29WG-n07km4acqGC5yyh_GOTLFM03cbdYeZ7Y-T5pM';

  const mockResponse: LoginResponse = {
    is_successful: true,
    token: VALID_STUDENT_TOKEN,
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
        JwtService,
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
    expect(sessionStorage.getItem('auth_token')).toBe(VALID_STUDENT_TOKEN);
  });

  it('login() stores token in sessionStorage and updates isAuthenticated on success', async () => {
    expect(service.isAuthenticated()).toBe(false);

    const loginPromise = service.login(validCredentials);
    const req = httpMock.expectOne(sessionUrl);
    req.flush(mockResponse);

    await loginPromise;
    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe(VALID_STUDENT_TOKEN);
  });

  it('login() exposes decoded user and role from the JWT', async () => {
    const loginPromise = service.login(validCredentials);
    const req = httpMock.expectOne(sessionUrl);
    req.flush(mockResponse);

    await loginPromise;
    expect(service.role()).toBe('student');
    expect(service.user()).toEqual({ userName: 'eider_test', role: 'student' });
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
    const loginPromise = service.login(validCredentials);
    const req = httpMock.expectOne(sessionUrl);
    req.flush(mockResponse);
    await loginPromise;

    expect(service.isAuthenticated()).toBe(true);
    expect(sessionStorage.getItem('auth_token')).toBe(VALID_STUDENT_TOKEN);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(service.role()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
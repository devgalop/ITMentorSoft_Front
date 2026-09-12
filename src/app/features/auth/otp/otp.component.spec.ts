import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { OtpComponent } from './otp.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

describe('OtpComponent', () => {
  let authMock: {
    pendingOtpUserId: ReturnType<typeof vi.fn>;
    validateOtp: ReturnType<typeof vi.fn>;
    homeRoute: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let toastMock: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  function createComponent(): OtpComponent {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        OtpComponent,
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastService, useValue: toastMock },
      ],
    });
    return TestBed.inject(OtpComponent);
  }

  beforeEach(() => {
    authMock = {
      pendingOtpUserId: vi.fn().mockReturnValue('u1'),
      validateOtp: vi.fn().mockResolvedValue({ is_successful: true, token: 't', message: 'ok' }),
      homeRoute: vi.fn().mockReturnValue('/student'),
    };
    routerMock = { navigate: vi.fn() };
    toastMock = { success: vi.fn(), error: vi.fn() };
  });

  it('redirects to /login when there is no pending login', () => {
    authMock.pendingOtpUserId.mockReturnValue(null);
    createComponent();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('accepts a valid 6-char hex code (uppercase)', () => {
    const c = createComponent();
    c.otpControl.setValue('A3F9C2');
    expect(c.otpForm.valid).toBe(true);
  });

  it('rejects codes that are not exactly 6 hex chars', () => {
    const c = createComponent();
    c.otpControl.setValue('A3F9C');       // 5 chars
    expect(c.otpForm.valid).toBe(false);
    c.otpControl.setValue('A3F9C2X');     // 7 chars
    expect(c.otpForm.valid).toBe(false);
    c.otpControl.setValue('G3F9C2');      // G no es hex
    expect(c.otpForm.valid).toBe(false);
  });

  it('uppercases the code as it is typed', () => {
    const c = createComponent();
    c.otpControl.setValue('a3f9c2');
    expect(c.otpControl.value).toBe('A3F9C2');
    expect(c.otpForm.valid).toBe(true);
  });

  it('validates the OTP and redirects by role on success', async () => {
    const c = createComponent();
    c.otpControl.setValue('A3F9C2');
    await c.onSubmit();
    expect(authMock.validateOtp).toHaveBeenCalledWith('u1', 'A3F9C2');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/student']);
  });

  it('shows an error toast when the code is wrong', async () => {
    authMock.validateOtp.mockResolvedValue({ is_successful: false, token: null, message: 'Código inválido' });
    const c = createComponent();
    c.otpControl.setValue('A3F9C2');
    await c.onSubmit();
    expect(toastMock.error).toHaveBeenCalledWith('Código incorrecto', 'Código inválido');
  });

  it('does not call validateOtp when the code is invalid', async () => {
    const c = createComponent();
    c.otpControl.setValue('123');
    await c.onSubmit();
    expect(authMock.validateOtp).not.toHaveBeenCalled();
  });
});

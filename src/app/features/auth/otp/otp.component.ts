import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ToastService } from '@shared/ui/toast/toast.service';
import { InputComponent, ButtonComponent, FormFieldComponent } from '@shared/ui';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, FormFieldComponent, RouterLink],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  readonly otpForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9A-F]{6}$/),
    ]),
  });

  constructor() {
    // Sin login previo (paso 1), no hay a quién validar: volver al login.
    if (!this.authService.pendingOtpUserId()) {
      void this.router.navigate(['/login']);
    }
    // El OTP es hexadecimal en mayúscula: normalizamos lo que se escribe.
    this.otpControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const upper = (value ?? '').toUpperCase();
      if (upper !== value) {
        this.otpControl.setValue(upper, { emitEvent: false });
      }
    });
  }

  get otpControl(): FormControl {
    return this.otpForm.get('otp') as FormControl;
  }

  getOtpError(): string | null {
    const ctrl = this.otpControl;
    if (!ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Ingresá el código';
    if (ctrl.hasError('pattern')) return 'El código son 6 caracteres (0-9, A-F)';
    return null;
  }

  async onSubmit(): Promise<void> {
    this.otpForm.markAllAsTouched();
    const userId = this.authService.pendingOtpUserId();

    if (this.otpForm.invalid || !userId) {
      if (!userId) {
        await this.router.navigate(['/login']);
      }
      return;
    }

    const otp = this.otpControl.value as string;

    this.isLoading.set(true);
    this.otpForm.disable();

    try {
      const response = await this.authService.validateOtp(userId, otp.trim());
      if (response.is_successful && response.token) {
        await this.router.navigate([this.authService.homeRoute()]);
      } else {
        this.toast.error('Código incorrecto', response.message || 'Revisá el código e intentá de nuevo.');
      }
    } catch (error) {
      this.toast.error(
        'No se pudo verificar',
        error instanceof Error ? error.message : 'Error inesperado',
      );
    } finally {
      this.isLoading.set(false);
      this.otpForm.enable();
    }
  }
}

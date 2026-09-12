import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
      Validators.minLength(4),
      Validators.maxLength(10),
    ]),
  });

  constructor() {
    // Sin login previo (paso 1), no hay a quién validar: volver al login.
    if (!this.authService.pendingOtpUserId()) {
      void this.router.navigate(['/login']);
    }
  }

  get otpControl(): FormControl {
    return this.otpForm.get('otp') as FormControl;
  }

  getOtpError(): string | null {
    const ctrl = this.otpControl;
    if (!ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'Ingresá el código';
    if (ctrl.hasError('minlength') || ctrl.hasError('maxlength')) return 'Código inválido';
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

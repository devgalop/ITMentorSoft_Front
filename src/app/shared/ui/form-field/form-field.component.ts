import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-form-field">
      @if (label) {
        <label [for]="forId" class="app-form-field__label">
          {{ label }}
        </label>
      }
      <ng-content />
      @if (error) {
        <span class="app-form-field__error" role="alert">
          {{ error }}
        </span>
      }
    </div>
  `,
  styles: `
    .app-form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .app-form-field__label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary);
    }

    .app-form-field__error {
      font-size: 0.875rem;
      color: #e53e3e;
    }
  `,
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() forId: string = '';
  @Input() error: string | null = null;
}

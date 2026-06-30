import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      [type]="type"
      [formControl]="control"
      [placeholder]="placeholder"
      [attr.name]="id"
      [attr.aria-invalid]="error ? true : null"
      [attr.aria-describedby]="error ? id + '-error' : null"
      [id]="id"
      class="app-input"
    />
    @if (error) {
      <span class="app-input__error" role="alert" [id]="id + '-error'">
        {{ error }}
      </span>
    }
  `,
  styles: `
    .app-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-light-1);
      border-radius: 0.5rem;
      font-size: 1rem;
      color: var(--color-primary);
      background: var(--color-white);
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: var(--color-secondary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 20%, transparent);
      }

      &[aria-invalid="true"] {
        border-color: #e53e3e;
      }

      &:disabled {
        background: var(--color-light-2);
        cursor: not-allowed;
      }
    }

    .app-input__error {
      display: block;
      margin-top: 0.375rem;
      font-size: 0.875rem;
      color: #e53e3e;
    }
  `,
})
export class InputComponent {
  @Input({ required: true }) id!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() error: string | null = null;
}

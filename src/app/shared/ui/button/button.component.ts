import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClass"
      (click)="buttonClick.emit()"
    >
      @if (loading) {
        <span class="app-button__spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, opacity 0.2s;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .app-button--primary {
      background: var(--color-secondary);
      color: var(--color-white);

      &:hover:not(:disabled) {
        background: var(--color-primary);
      }
    }

    .app-button--outline {
      background: transparent;
      border: 2px solid var(--color-secondary);
      color: var(--color-secondary);

      &:hover:not(:disabled) {
        background: var(--color-secondary);
        color: var(--color-white);
      }
    }

    .app-button__spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  get buttonClass(): string {
    return `app-button--${this.variant}`;
  }
}

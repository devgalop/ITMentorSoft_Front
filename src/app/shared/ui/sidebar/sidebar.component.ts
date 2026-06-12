import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '@shared/ui';
import { AuthService } from '@core/auth/auth.service';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="isCollapsed()">
      <div class="sidebar__header">
        <span class="sidebar__brand">ITMentorSoft</span>
        <button class="sidebar__toggle" (click)="toggle()" aria-label="Toggle sidebar">
          @if (isCollapsed()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          }
        </button>
      </div>
      <nav class="sidebar__nav">
        <!-- Future nav items will go here -->
      </nav>
      <div class="sidebar__footer">
        <app-button variant="outline" type="button" (buttonClick)="onLogout()">
          Cerrar sesión
        </app-button>
      </div>
    </aside>
  `,
  styles: `
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 100vh;
      background-color: var(--color-primary);
      color: var(--color-white);
      padding: 1.5rem;
      transition: width 0.3s ease, padding 0.3s ease;
      z-index: 100;
    }

    .sidebar--collapsed {
      width: 60px;
      padding: 1.5rem 0.75rem;
    }

    .sidebar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar__brand {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      white-space: nowrap;
      overflow: hidden;
      transition: opacity 0.2s;
    }

    .sidebar--collapsed .sidebar__brand {
      opacity: 0;
      width: 0;
    }

    .sidebar__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.375rem;
      color: var(--color-white);
      cursor: pointer;
      flex-shrink: 0;
      transition: background-color 0.2s;
    }

    .sidebar__toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .sidebar__toggle svg {
      width: 16px;
      height: 16px;
    }

    .sidebar__nav {
      flex: 1;
      padding: 1rem 0;
    }

    .sidebar__footer {
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar--collapsed .sidebar__footer app-button {
      display: none;
    }

    .sidebar__footer app-button ::ng-deep button {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .sidebar__footer app-button ::ng-deep button:hover:not(:disabled) {
      background-color: var(--color-accent);
      color: var(--color-white);
    }
  `,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly sidebarService = inject(SidebarService);

  protected readonly isCollapsed = this.sidebarService.isCollapsed;

  protected toggle(): void {
    this.sidebarService.toggle();
  }

  protected onLogout(): void {
    this.authService.logout();
  }
}

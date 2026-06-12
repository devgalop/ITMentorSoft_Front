import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from '@shared/ui/sidebar/sidebar.component';
import { SidebarService } from '@shared/ui/sidebar/sidebar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-layout">
      <app-sidebar />
      <main class="dashboard-content" [class.dashboard-content--collapsed]="isCollapsed()">
        <ng-content />
      </main>
    </div>
  `,
  styles: `
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .dashboard-content {
      flex: 1;
      margin-left: 250px;
      padding: 2rem;
      background-color: var(--color-light-2);
      transition: margin-left 0.3s ease;
    }

    .dashboard-content--collapsed {
      margin-left: 60px;
    }
  `,
})
export class DashboardComponent {
  private readonly sidebarService = inject(SidebarService);
  protected readonly isCollapsed = this.sidebarService.isCollapsed;
}

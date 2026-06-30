import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly isCollapsed = signal(true);

  toggle(): void {
    this.isCollapsed.update(v => !v);
  }
}

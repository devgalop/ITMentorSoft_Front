import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="welcome">
      <div class="welcome__logo">🤖</div>
      <h1 class="welcome__title">Bienvenido a ITMentorSoft</h1>
      <p class="welcome__subtitle">Tu tutor inteligente de desarrollo de software</p>
    </div>
  `,
  styles: `
    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      gap: 1rem;
    }

    .welcome__logo {
      font-size: 4rem;
      margin-bottom: 0.5rem;
    }

    .welcome__title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .welcome__subtitle {
      font-size: 1.125rem;
      color: var(--color-mid-1);
    }
  `,
})
export class HomeComponent {}

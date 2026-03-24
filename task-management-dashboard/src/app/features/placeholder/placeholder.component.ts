import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `<p class="placeholder">This section is coming soon.</p>`,
  styles: [
    `
      .placeholder {
        margin: 0;
        padding: 1.5rem;
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
})
export class PlaceholderComponent {}

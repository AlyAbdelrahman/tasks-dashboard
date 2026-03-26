import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  SearchTasksModalComponent,
  SearchTasksModalData,
} from '../../../modal/search-tasks-modal/search-tasks-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatFormField, MatInput, MatPrefix, MatIcon, MatIconButton],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly dialog = inject(MatDialog);
  readonly menuToggle = output<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  openSearch(inputEl: HTMLInputElement): void {
    const query = inputEl.value;

    this.dialog.open<SearchTasksModalComponent, SearchTasksModalData>(
      SearchTasksModalComponent,
      {
        width: '660px',
        maxWidth: '95vw',
        restoreFocus: false,
        data: { initialQuery: query },
      },
    );

    inputEl.value = '';
    inputEl.blur();
  }
}

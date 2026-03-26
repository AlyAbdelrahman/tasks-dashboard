import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let matDialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    matDialog = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: MatDialog, useValue: matDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens search modal with current input value', () => {
    const input = document.createElement('input');
    input.value = 'budget';
    input.blur = vi.fn();

    component.openSearch(input);

    expect(matDialog.open).toHaveBeenCalledTimes(1);
    expect(matDialog.open.mock.calls[0][1]).toMatchObject({
      data: { initialQuery: 'budget' },
      width: '660px',
      maxWidth: '95vw',
      restoreFocus: false,
    });
  });

  it('clears and blurs search input after opening modal', () => {
    const input = document.createElement('input');
    input.value = 'finance';
    input.blur = vi.fn();

    component.openSearch(input);

    expect(input.value).toBe('');
    expect(input.blur).toHaveBeenCalled();
  });
});

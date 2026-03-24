import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatFormField, MatInput, MatPrefix, MatIcon, MatIconButton],
  templateUrl: './header.html',
})
export class Header {}

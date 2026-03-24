import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';

export interface DashboardStat {
  label: string;
  value: string;
  emoji: string;
  hint: string;
  hintType: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [NgClass, MatCard, MatCardContent],
  templateUrl: './dashboard-overview.component.html'
})
export class DashboardOverviewComponent {
  readonly stats: DashboardStat[] = [
    {
      label: 'Total Tasks',
      value: '156',
      emoji: '📊',
      hint: '+12 this week',
      hintType: 'positive',
    },
    {
      label: 'Completed',
      value: '89',
      emoji: '✅',
      hint: '+8 today',
      hintType: 'positive',
    },
    {
      label: 'In Progress',
      value: '42',
      emoji: '🔄',
      hint: 'Same as yesterday',
      hintType: 'neutral',
    },
    {
      label: 'Overdue',
      value: '25',
      emoji: '⚠️',
      hint: '+3 today',
      hintType: 'negative',
    },
  ];
}

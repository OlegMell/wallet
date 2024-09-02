import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Expense } from '../../core/interfaces/expense.interface';

@Component( {
  selector: 'app-expenses-list',
  standalone: true,
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ExpensesListComponent {
  expenses = input.required<Expense[]>();
}


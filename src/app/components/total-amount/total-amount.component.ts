import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Expense } from '../../core/interfaces/expense.interface';

@Component({
  standalone: true,
  selector: 'app-total-amount',
  templateUrl: './total-amount.component.html',
  styleUrl: './total-amount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAmountComponent {
  expenses = input.required<Expense[]>();

  get total(): number {
    return this.expenses()
      .map((expense) => expense.sum)
      .reduce((acc: number, value: number) => acc + value, 0);
  }

}

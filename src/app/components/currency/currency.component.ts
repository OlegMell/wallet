import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CurrencyService } from '../../core/features/currency/currency.service';

@Component({
  standalone: true,
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe
  ]
})
export class CurrencyComponent {
  public readonly currencyService: CurrencyService = inject(CurrencyService);
}

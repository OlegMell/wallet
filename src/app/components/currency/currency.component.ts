import { Component, inject } from '@angular/core';

import { CurrencyService } from '../../core/features/currency/currency.service';
import { AsyncPipe } from '@angular/common';

@Component( {
    standalone: true,
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrl: './currency.component.scss',
    imports: [
        AsyncPipe
    ]
} )
export class CurrencyComponent {
    public readonly currencyService: CurrencyService = inject( CurrencyService );
}
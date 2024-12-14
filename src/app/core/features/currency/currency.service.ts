import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Currency } from '../../interfaces/currency.interface';

export const CurrencyURL: string = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

export enum CurrencyType {
    EUR = 'eur',
    USD = 'usd'
}

export const REQUEIRED = [ CurrencyType.EUR, CurrencyType.USD ];

@Injectable( {
    providedIn: 'root'
} )
export class CurrencyService {
    private readonly http: HttpClient = inject( HttpClient );

    #currencies!: Observable<Currency[]>;

    get currency(): Observable<Currency[]> {
        return this.#currencies;
    }

    public fetchCurrencies(): void {
        this.#currencies = this.http.get<Currency[]>( CurrencyURL )
            .pipe(
                map( ( currencies: Currency[] ) =>
                    currencies.filter( ( c: Currency ) =>
                        REQUEIRED.includes( c.cc.toLocaleLowerCase() as CurrencyType ) )
                )
            );
    }
}

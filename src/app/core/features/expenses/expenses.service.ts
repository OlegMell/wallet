import dayjs from 'dayjs';
import { inject, Injectable } from '@angular/core';
import { EMPTY, from, map, Observable, of, switchMap } from 'rxjs';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import { Expense } from '../../interfaces/expense.interface';
import { DateRange } from '../../../components/calendar/calendar.component';
import { ExpensesRepository } from '../../../store/repositories/expenses-repository.service';


export const DRUG_STORE_ID = 'yBvK7Atjhsa1VSXd7ucX';
export const MEDICInE_CATEGORY_ID = 'yXq8VjJ6RLmz0Z8jBDyK';

@Injectable( {
    providedIn: 'root'
} )
export class ExpensesService {

    private readonly authService: AuthService = inject( AuthService );
    private readonly repository: ExpensesRepository = inject( ExpensesRepository );

    #expenses: Observable<Expense[]> = of( [] );

    get expenses(): Observable<Expense[]> {
        return this.#expenses;
    }

    fetchData(): void {
        this.#expenses = this.repository.getAll( this.authService.fireBaseUser()!.id )
            .pipe(
                map( ( querySnapshot ) => {
                    if ( ( querySnapshot as QuerySnapshot ).size ) {
                        const data: Expense[] = [];

                        ( querySnapshot as QuerySnapshot ).forEach( ( doc: DocumentSnapshot ) => {
                            data.push( doc.data() as Expense );
                        } );

                        return data;
                    }

                    return [];
                } )
            );
    }

    fetchByDate( date: string ): Observable<Expense[]> {
        if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser()?.id! ) {
            return EMPTY;
        }

        return this.repository.getByDate( date, this.authService.fireBaseUser()?.id! )
    }

    fetchByRange( range: DateRange ): Observable<Expense[]> {
        if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser()?.id ) {
            return EMPTY;
        }

        return this.repository.getByRange( range, this.authService.fireBaseUser()?.id! )
    }

    // fetchByMonth(): Observable<Expense[]> {
    //     if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser.id ) {
    //         return EMPTY;
    //     }

    //     return this.repository.getByDate( date, this.authService.fireBaseUser.id )
    // }

    getSumForMonth(): Observable<number> {
        if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser()!.id ) {
            return EMPTY;
        }

        return this.repository.getSumByDateRange( dayjs().startOf( 'month' ).format( 'DD.MM.YYYY' ),
            dayjs().endOf( 'month' ).format( 'DD.MM.YYYY' ), this.authService.fireBaseUser()!.id )
    }

    create( expenses: { shop: string, expenses: Partial<Expense>[] }, date: dayjs.Dayjs ): Observable<any> {
        return from( expenses.expenses )
            .pipe(
                switchMap( ( expense ) => this.repository.add( {
                    ...expense,
                    shopId: isMedicineCategory( expense.categoryId ) ? DRUG_STORE_ID : expenses.shop,
                    userId: this.authService.fireBaseUser()?.id,
                    date: date.format( 'DD.MM.YYYY' ),
                    sum: expense.sum ? +expense.sum : 0
                } ) )
            );
    }

    clearData(): void {
        this.#expenses = EMPTY;
    }

}

function isMedicineCategory( categoryId: string | undefined ): boolean {
    return categoryId === MEDICInE_CATEGORY_ID;
}

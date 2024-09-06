import { EMPTY, from, map, Observable, switchMap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import { Expense } from '../../interfaces/expense.interface';
import { ExpensesRepository } from '../../../store/repositories/expenses-repository.service';
import dayjs from 'dayjs';


export const DRUG_STORE_ID = 'yBvK7Atjhsa1VSXd7ucX';
export const MEDICInE_CATEGORY_ID = 'yXq8VjJ6RLmz0Z8jBDyK';

@Injectable( {
    providedIn: 'root'
} )
export class ExpensesService {

    private readonly authService: AuthService = inject( AuthService );
    private readonly repository: ExpensesRepository = inject( ExpensesRepository );

    #expenses!: Observable<Expense[]>;

    get expenses(): Observable<Expense[]> {
        return this.#expenses;
    }

    fetchData(): void {
        this.#expenses = this.repository.getAll( this.authService.fireBaseUser.id )
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

        console.log( this.authService.fireBaseUser )
        console.log( this.authService.fireBaseUser?.id )

        if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser.id ) {
            return EMPTY;
        }

        return this.repository.getByDate( date, this.authService.fireBaseUser.id )
    }

    create( expenses: { shop: string, expenses: Partial<Expense>[] }, date: dayjs.Dayjs ): Observable<any> {
        return from( expenses.expenses )
            .pipe(
                switchMap( ( expense ) => this.repository.add( {
                    ...expense,
                    shopId: isMedicineCategory( expense.categoryId ) ? DRUG_STORE_ID : expenses.shop,
                    userId: this.authService.fireBaseUser.id,
                    date: date.format( 'DD.MM.YYYY' )
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

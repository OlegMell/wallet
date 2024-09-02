import { EMPTY, from, map, Observable, switchMap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import { Expense } from '../../interfaces/expense.interface';
import { ExpensesRepository } from '../../../store/repositories/expenses-repository.service';

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
        if ( !this.authService.fireBaseUser || !this.authService.fireBaseUser.id ) {
            return EMPTY;
        }

        return this.repository.getByDate( date, this.authService.fireBaseUser.id )
    }

    create( expenses: { shop: string, expenses: Partial<Expense>[] } ): Observable<any> {
        return from( expenses.expenses )
            .pipe(
                switchMap( ( expense ) => this.repository.add( {
                    ...expense,
                    shopId: expenses.shop,
                    userId: this.authService.fireBaseUser.id
                } ) )
            );
    }

    clearData(): void {
        this.#expenses = EMPTY;
    }

}
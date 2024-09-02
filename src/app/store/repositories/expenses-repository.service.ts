import { EMPTY, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot, where } from '@angular/fire/firestore';

import { RepositoryService } from './repository-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { ExpensesFireBaseService } from '../data/expenses.service';

@Injectable( {
    providedIn: 'root'
} )
export class ExpensesRepository implements RepositoryService<Expense> {

    private readonly expensesService: ExpensesFireBaseService = inject( ExpensesFireBaseService );

    getAll( userId: FireBaseId ): Observable<Expense[] | QuerySnapshot> {
        return this.expensesService.getAll( userId );
    }

    getByDate( date: string, userId: FireBaseId ): Observable<Expense[]> {
        return this.expensesService.getBy(
            where( "userId", "==", userId ),
            where( "date", "==", date )
        ).pipe( map( ( q: QuerySnapshot ) => this.getDataFromQuerySnapshot( q ) ) );
    }

    getOne( id: FireBaseId ): Observable<Expense> {
        return EMPTY;
    }

    add( expense: Partial<Expense> ): Observable<any> {
        console.log( expense )
        return this.expensesService.add( expense );
    }

    update(): Observable<any> {
        return EMPTY;
    }

    private getDataFromQuerySnapshot<T>( q: QuerySnapshot ): T[] {
        if ( ( q as QuerySnapshot ).size ) {
            const data: T[] = [];

            ( q as QuerySnapshot ).forEach( ( doc: DocumentSnapshot ) => {
                data.push( doc.data() as T );
            } );

            return data;
        }

        return [];
    }

}
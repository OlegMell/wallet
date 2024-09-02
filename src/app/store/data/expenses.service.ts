import { EMPTY, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, getDocs, Query, query, QueryFieldFilterConstraint, QuerySnapshot, where } from '@angular/fire/firestore';

import { FireBaseService } from './firebase-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { addDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

@Injectable( {
    providedIn: 'root',
} )
export class ExpensesFireBaseService implements FireBaseService<Expense> {

    private readonly store = inject( Firestore );

    private readonly expensesCollection = collection( this.store, 'expenses' );

    getAll( userId: FireBaseId ): Observable<Expense[] | QuerySnapshot> {
        if ( userId ) {
            const q = query( this.expensesCollection, where( "userId", "==", userId ) );
            return from( getDocs( q ) );
        } else {
            return collectionData( this.expensesCollection ) as Observable<Expense[]>;
        }
    }

    getOne( id: FireBaseId ): Observable<Expense> {
        return EMPTY;
    }

    getBy( ...queryFilter: QueryFieldFilterConstraint[] ): Observable<QuerySnapshot> {
        const q = query( this.expensesCollection, ...queryFilter );
        return from( getDocs( q ) );
    }

    add( expense: Partial<Expense> ): Observable<any> {
        const expenseToCreate = { ...expense, date: dayjs().format( 'DD.MM.YYYY' ) };
        return from( addDoc( this.expensesCollection, expenseToCreate ) );
    }

    update(): Observable<any> {
        return EMPTY;
    }

}
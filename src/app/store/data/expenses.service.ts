import { EMPTY, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, getAggregateFromServer, getDocs, Query, query, QueryFieldFilterConstraint, QuerySnapshot, sum, where } from '@angular/fire/firestore';

import { FireBaseService } from './firebase-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { addDoc, AggregateQuerySnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

@Injectable( {
    providedIn: 'root',
} )
export class ExpensesFireBaseService implements FireBaseService<Expense> {

    private readonly store = inject( Firestore );

    private readonly expensesCollection = collection( this.store, 'expenses' );

    getAll( userId: FireBaseId ): Observable<Expense[] | QuerySnapshot> {
        if ( userId ) {
            const q = query( this.expensesCollection, where( "userId", "==", userId ), );
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

    getSumBy( ...queryFilter: QueryFieldFilterConstraint[] ): Observable<any> {
        const q = query( this.expensesCollection, ...queryFilter )
        return from( getAggregateFromServer( q, {
            totalSum: sum( 'sum' )
        } ) );
    }

    add( expense: Partial<Expense> ): Observable<any> {
        const expenseToCreate = { ...expense };
        return from( addDoc( this.expensesCollection, expenseToCreate ) );
    }

    update(): Observable<any> {
        return EMPTY;
    }

}
import { EMPTY, from, Observable, of, switchMap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, doc, getDoc, addDoc, DocumentReference, DocumentSnapshot, query, where } from '@angular/fire/firestore';

import { FireBaseService } from './firebase-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { getDocs, QuerySnapshot } from 'firebase/firestore';

@Injectable( {
    providedIn: 'root',
} )
export class UsersFireBaseService implements FireBaseService<any> {

    private readonly store = inject( Firestore );

    private readonly usersCollection = collection( this.store, 'users' );

    getAll(): Observable<Expense[]> {
        return collectionData( this.usersCollection ) as Observable<any[]>;
    }

    getOne( id: FireBaseId ): Observable<QuerySnapshot> {
        const q = query( this.usersCollection, where( "email", "==", id ) );
        return from( getDocs( q ) );
    }

    add( user: { email: string, fullName: string } ): Observable<any> {
        return this.getOne( user.email )
            .pipe( switchMap( ( q: QuerySnapshot ) => {
                if ( q.size ) {
                    return of( q.docs[ 0 ] )
                } else {
                    return from( addDoc( this.usersCollection, user ) )
                }
            } ) );
    }

    update(): Observable<any> {
        return EMPTY;
    }

}
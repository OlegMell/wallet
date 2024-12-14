import { EMPTY, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { getDocs, QuerySnapshot } from 'firebase/firestore';
import { addDoc, collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';

import { FireBaseService } from './firebase-service';
import { Shop } from '../../core/interfaces/shop.interface';
import { FireBaseId } from '../../core/types/firebase-id.type';

@Injectable( {
    providedIn: 'root',
} )
export class ShopsFireBaseService implements FireBaseService<any> {

    private readonly store = inject( Firestore );

    private readonly collection = collection( this.store, 'shops' );

    getAllByUserId(): Observable<Shop[]> {
        return collectionData( this.collection, {
            idField: 'id'
        } ) as Observable<any[]>;
    }

    getOne( id: FireBaseId ): Observable<QuerySnapshot> {
        const q = query( this.collection, where( "email", "==", id ) );
        return from( getDocs( q ) );
    }

    add( user: { email: string, fullName: string } ): Observable<any> {
        return from( addDoc( this.collection, user ) );
    }

    update(): Observable<any> {
        return EMPTY;
    }

}

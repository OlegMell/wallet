import { EMPTY, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  getAggregateFromServer,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  sum,
  where
} from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';

import { FireBaseService } from './firebase-service';
import { Group } from '../../core/interfaces/group.interface';
import { FireBaseId } from '../../core/types/firebase-id.type';

@Injectable( {
    providedIn: 'root',
} )
export class GroupsFireBaseService implements FireBaseService<Group> {

    private readonly store = inject( Firestore );

    private readonly groupsCollection = collection( this.store, 'group' );

    getAllByUserId( userId: FireBaseId ): Observable<QuerySnapshot> {
        const q = query( this.groupsCollection, where( "users", "array-contains", userId ) );
        return from( getDocs( q ) );
    }

    getOne( id: FireBaseId ): Observable<Group> {
        return EMPTY;
    }

    getBy( ...queryFilter: QueryFieldFilterConstraint[] ): Observable<QuerySnapshot> {
        const q = query( this.groupsCollection, ...queryFilter );
        return from( getDocs( q ) );
    }

    getSumBy( ...queryFilter: QueryFieldFilterConstraint[] ): Observable<any> {
        const q = query( this.groupsCollection, ...queryFilter )
        return from( getAggregateFromServer( q, {
            totalSum: sum( 'sum' )
        } ) );
    }

    add( group: Partial<Group> ): Observable<any> {
        const toCreate = { ...group };
        return from( addDoc( this.groupsCollection, toCreate ) );
    }

    update(): Observable<any> {
        return EMPTY;
    }

}

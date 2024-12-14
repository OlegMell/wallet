import { EMPTY, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { RepositoryService } from './repository-service';
import { Shop } from '../../core/interfaces/shop.interface';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { ShopsFireBaseService } from '../data/shops-firebase.service';

@Injectable( {
    providedIn: 'root'
} )
export class ShopsRepository implements RepositoryService<Shop> {

    private readonly shopsService: ShopsFireBaseService = inject( ShopsFireBaseService );

    getAll(): Observable<Shop[]> {
        return this.shopsService.getAllByUserId();
    }

    getOne( id: FireBaseId ): Observable<Expense> {
        return EMPTY;
    }

    add(): Observable<any> {
        return EMPTY;
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

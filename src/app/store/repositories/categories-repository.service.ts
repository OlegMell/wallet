import { EMPTY, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot, where } from '@angular/fire/firestore';

import { RepositoryService } from './repository-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Expense } from '../../core/interfaces/expense.interface';
import { ExpensesFireBaseService } from '../data/expenses.service';
import { ShopsFireBaseService } from '../data/shops-firebase.service';
import { Shop } from '../../core/interfaces/shop.interface';
import { Category } from '../../core/interfaces/category.interface';
import { CategoriesFireBaseService } from '../data/categories-firebase.service';

@Injectable( {
    providedIn: 'root'
} )
export class CategoriesRepository implements RepositoryService<Category> {

    private readonly categoriesService: CategoriesFireBaseService = inject( CategoriesFireBaseService );

    getAll( userId: string ): Observable<Category[]> {
        return this.categoriesService.getAllByUserId( userId )
            .pipe(
                map( ( q ) => this.getDataFromQuerySnapshot( q ) )
            )
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
                data.push( { id: doc.id, ...doc.data() as T } );
            } );

            return data;
        }

        return [];
    }

}
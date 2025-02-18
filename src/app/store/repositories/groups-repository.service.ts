import { EMPTY, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { RepositoryService } from './repository-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Group } from '../../core/interfaces/group.interface';
import { GroupsFireBaseService } from '../data/groups-firebase.service';

@Injectable( {
    providedIn: 'root'
} )
export class GroupsRepository implements RepositoryService<Group> {

    private readonly groupsService: GroupsFireBaseService = inject( GroupsFireBaseService );

    getAll( userId: FireBaseId ): Observable<Group[]> {
        return this.groupsService.getAllByUserId( userId )
            .pipe( map( ( q ) => this.getDataFromQuerySnapshot( q ) ) );
    }

    getOne( id: FireBaseId ): Observable<Group> {
        return EMPTY;
    }

    add( group: Partial<Group> ): Observable<any> {
        return this.groupsService.add( group );
    }

    update(): Observable<any> {
        return EMPTY;
    }

    private getDataFromQuerySnapshot<T>( q: QuerySnapshot ): T[] {

        console.log( q )
        if ( ( q as QuerySnapshot ).size ) {
            const data: T[] = [];

            ( q as QuerySnapshot ).forEach( ( doc: DocumentSnapshot ) => {
                console.log( doc.data() )
                data.push({ id: doc.id, ...doc.data() } as T );
            } );

          console.log(data);
          return data;
        }

        return [];
    }

    private getDataFromAggregatedQuerySnapshot<T>( q: QuerySnapshot ): T[] {
        return ( q as any ).data();
    }

}

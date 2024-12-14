import { EMPTY, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { QuerySnapshot } from 'firebase/firestore';

import { RepositoryService } from './repository-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { UsersFireBaseService } from '../data/users-firebase.service';

@Injectable( {
    providedIn: 'root'
} )
export class UsersRepository implements RepositoryService<any> {

    private readonly usersFireBaseService: UsersFireBaseService = inject( UsersFireBaseService );

    add( user: { email: string, fullName: string } ): Observable<any> {
        return this.usersFireBaseService.add( user );
    }

    getAll(): Observable<any[]> {
        return EMPTY;
    }

    getOne( id: FireBaseId ): Observable<QuerySnapshot> {
        return this.usersFireBaseService.getOne( id );
    }

    update(): Observable<any> {
        return EMPTY;
    }
}

import { inject, Injectable } from '@angular/core';
import { EMPTY, map, Observable, of, scan, shareReplay, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Group } from '../../interfaces/group.interface';
import { GroupsRepository } from '../../../store/repositories/groups-repository.service';

@Injectable( {
    providedIn: 'root'
} )
export class GroupsService {

    private readonly authService: AuthService = inject( AuthService );
    private readonly repository: GroupsRepository = inject( GroupsRepository );

    #groups: Observable<Group[]> = of( [] );

    get groups(): Observable<Group[]> {
        return this.#groups;
    }

    fetchData(): void {
        this.#groups = this.repository.getAll( this.authService.fireBaseUser()!.id ).pipe(
            shareReplay()
        );
    }

    addGroup( { name, users }: any ): Observable<any> {
        if ( !name.trim() || !users || !users.length ) {
            return EMPTY;
        }

        users = users.replaceAll( ' ', '' ).split( ',' );

        const result = of( ...users )
            .pipe(
                switchMap( ( user ) => {
                    return this.authService.findUser( user as string )
                } ),
                scan( ( all: any[], fireBaseUser ) => {
                    if ( fireBaseUser ) {
                        return [ ...all, fireBaseUser! ];
                    }
                    return [ ...all ];
                }, [] ),
            );

        return result.pipe(
            // tap( ( u ) => u.forEach( user => console.log( user.docs[ 0 ]!.id ) ) ),
            map( ( users ) => users.map( user => user.docs[ 0 ].id ) ),
            // tap( ( u ) => console.log( u ) ),
            switchMap( users => this.repository.add( {
                name,
                users: [ ...users, this.authService.fireBaseUser()!.id ]
            } ) )
        );
    }

    clearData(): void {
        this.#groups = EMPTY;
    }

}

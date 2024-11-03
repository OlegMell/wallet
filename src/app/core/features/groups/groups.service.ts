import { EMPTY, map, Observable, of, shareReplay, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

import { AuthService } from '../auth/auth.service';
import { CategoriesRepository } from '../../../store/repositories/categories-repository.service';
import { Category } from '../../interfaces/category.interface';
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

    clearData(): void {
        this.#groups = EMPTY;
    }

}
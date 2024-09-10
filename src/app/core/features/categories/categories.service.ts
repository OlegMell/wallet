import { EMPTY, map, Observable, of, shareReplay, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import { CategoriesRepository } from '../../../store/repositories/categories-repository.service';
import { Category } from '../../interfaces/category.interface';

@Injectable( {
    providedIn: 'root'
} )
export class CategoriesService {

    private readonly authService: AuthService = inject( AuthService );
    private readonly repository: CategoriesRepository = inject( CategoriesRepository );

    #categories: Observable<Category[]> = of( [] );

    get categories(): Observable<Category[]> {
        return this.#categories;
    }

    fetchData(): void {
        this.#categories = this.repository.getAll().pipe(
            shareReplay()
        );
    }

    clearData(): void {
        this.#categories = EMPTY;
    }

}
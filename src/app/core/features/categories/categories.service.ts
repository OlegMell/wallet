import { Auth } from '@angular/fire/auth';
import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable, of, shareReplay, tap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Category } from '../../interfaces/category.interface';
import { CategoriesRepository } from '../../../store/repositories/categories-repository.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly auth = inject(Auth);
  private readonly authService: AuthService = inject(AuthService);
  private readonly repository: CategoriesRepository = inject(CategoriesRepository);

  #categories: Observable<Category[]> = of([]);

  get categories(): Observable<Category[]> {
    return this.#categories;
  }

  fetchData(): void {
    this.#categories = this.repository.getAll(this.authService.fireBaseUser()!.id).pipe(
      shareReplay(),
      tap(() => console.log('SHARE'))
    );
  }

  clearData(): void {
    this.#categories = EMPTY;
  }

}

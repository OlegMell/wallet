import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { AuthService } from '../../core/features/auth/auth.service';
import { UsersRepository } from '../../store/repositories/users-repository.service';
import { ExpensesService } from '../../core/features/expenses/expenses.service';
import { ShopsService } from '../../core/features/shops/shops.service';
import { CategoriesService } from '../../core/features/categories/categories.service';

@Component( {
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe
    ]
} )
export class Header {
    readonly authService: AuthService = inject( AuthService );
    readonly expensesService: ExpensesService = inject( ExpensesService );
    readonly shopsService: ShopsService = inject( ShopsService );
    readonly categoriesService: CategoriesService = inject( CategoriesService );
    readonly usersRepository: UsersRepository = inject( UsersRepository );
    readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );

    signIn(): void {
        this.authService.signIn()
            .subscribe( () => {
                this.categoriesService.fetchData();
                this.shopsService.fetchData();
                this.cd.markForCheck();
            } );
    }

    logout() {
        this.authService.logout();
    }
}
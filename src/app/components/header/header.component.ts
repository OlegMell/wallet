import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';

import { AuthService } from '../../core/features/auth/auth.service';
import { UsersRepository } from '../../store/repositories/users-repository.service';
import { ExpensesService } from '../../core/features/expenses/expenses.service';
import { ShopsService } from '../../core/features/shops/shops.service';
import { CategoriesService } from '../../core/features/categories/categories.service';
import { CurrencyService } from '../../core/features/currency/currency.service';
import { CurrencyComponent } from "../currency/currency.component";
import { GroupsService as GroupsService } from '../../core/features/groups/groups.service';

@Component( {
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        CurrencyComponent
    ]
} )
export class Header implements OnInit {
    readonly authService: AuthService = inject( AuthService );
    readonly expensesService: ExpensesService = inject( ExpensesService );
    readonly shopsService: ShopsService = inject( ShopsService );
    readonly categoriesService: CategoriesService = inject( CategoriesService );
    readonly usersRepository: UsersRepository = inject( UsersRepository );
    readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );
    readonly currencyService: CurrencyService = inject( CurrencyService );
    readonly groupsService: GroupsService = inject( GroupsService );

    constructor() {
        effect( () => {
            if ( this.authService.currentGoogleUser() && this.authService.fireBaseUser() ) {
                this.fetchInitialData();
            }
        } )
    }

    ngOnInit(): void {
        this.currencyService.fetchCurrencies();
        this.cd.markForCheck();
    }

    signIn(): void {
        this.authService.signIn()
            .subscribe( () => {
                this.fetchInitialData();
            } );
    }

    logout() {
        this.authService.logout();
    }

    private fetchInitialData() {
        this.categoriesService.fetchData();
        this.shopsService.fetchData();
        this.groupsService.fetchData();
        this.cd.markForCheck();
    }
}
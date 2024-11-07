
import { first } from 'rxjs';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, effect, inject, input,
  OnInit,
  output,
  signal, WritableSignal
} from '@angular/core';

import { Shop } from './../../core/interfaces/shop.interface';
import { Expense } from '../../core/interfaces/expense.interface';
import { CategoriesService } from '../../core/features/categories/categories.service';
import { Category } from '../../core/interfaces/category.interface';
import { ShopsService } from '../../core/features/shops/shops.service';
import { TotalAmountComponent } from '../total-amount/total-amount.component';
import { CATEGORIES } from '../../core/categories.enum';
import { GroupsService } from '../../core/features/groups/groups.service';


@Component( {
  standalone: true,
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ TotalAmountComponent ],
} )
export class ExpensesListComponent implements OnInit {
  showAddExpensesForm: any;

  expenses = input.required<Expense[]>();

  showAddExpencesFormClicked = output();

  displayedExpenses: WritableSignal<Expense[]> = signal( [] );

  private readonly categoriesService: CategoriesService = inject( CategoriesService );
  private readonly shopsService: ShopsService = inject( ShopsService );
  private readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );
  private readonly groupsService: GroupsService = inject( GroupsService );

  expensesByCategoryMap = new Map();
  expensesByShopMap = new Map();

  selectedShop: Shop | undefined;
  selectedCategory: Category | undefined;

  constructor() {
    effect( () => {
      if ( this.expenses() ) {
        this.selectedShop = undefined;
        this.selectedCategory = undefined;
        this.mapExpensesByCategory();
        this.expensesByShopMap.clear();
        this.displayedExpenses.set( this.expenses() );
      }
    }, { allowSignalWrites: true } );

    effect( () => {
      if ( this.displayedExpenses() ) {
        this.selectedShop = undefined;
        this.mapExpensesByShop();
      }
    }, { allowSignalWrites: true } )
  }

  ngOnInit(): void {
    this.groupsService.groups.subscribe( s => {
      console.log( s )
    } )
  }

  handleAddExpense(): void {
    this.showAddExpencesFormClicked.emit();
  }

  handleCategoryTotal( category: Category ): void {
    this.selectedCategory = category;
    this.displayedExpenses.set( this.expensesByCategoryMap.get( category ) );
  }

  handleDayTotalClick(): void {
    this.selectedCategory = undefined;
    this.showAllExpenses();
  }

  handleSelectShop( shop: Shop ): void {
    if ( this.selectedShop && this.selectedShop.id === shop.id ) {
      this.selectedShop = undefined;
    } else {
      this.selectedShop = shop;
    }
  }

  private showAllExpenses(): void {
    this.displayedExpenses.set( this.expenses() );
  }

  private mapExpensesByShop(): void {
    this.shopsService.shops
      .pipe( first() )
      .subscribe( ( shops: Shop[] ) => {
        this.expensesByShopMap = new Map();

        shops.forEach( ( shop: Shop ) => {
          const expensesByShop = this.displayedExpenses()
            .filter( ( expense: Expense ) => expense.shopId === shop.id );

          this.expensesByShopMap.set( shop, expensesByShop );

          this.cd.markForCheck();
        } );

        const enterteinmentExpenses = this.displayedExpenses().filter( ( exp: Expense ) => exp.categoryId === CATEGORIES.ENTERTAINMENT );

        if ( enterteinmentExpenses.length ) {
          enterteinmentExpenses.forEach( ( exp: Expense, idx: number ) => {
            this.expensesByShopMap.set( {
              id: idx,
              title: exp.title
            }, [ exp ] );
          } )
        }

      } );
  }

  private mapExpensesByCategory(): void {
    this.categoriesService.categories
      .pipe( first() )
      .subscribe( ( categories: Category[] ) => {

        console.log( categories )

        this.expensesByCategoryMap = new Map();

        categories.forEach( ( category: Category ) => {
          const expensesByCategory = this.expenses()
            .filter( ( expense: Expense ) => expense.categoryId === category.id );

          this.expensesByCategoryMap.set( category, expensesByCategory );
          this.cd.markForCheck();
        } );
      } );
  }
}


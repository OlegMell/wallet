import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, OnInit, output, viewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ShopsService } from '../../core/features/shops/shops.service';
import { CategoriesService } from '../../core/features/categories/categories.service';
import { Shops } from '../../core/shops.enum';
import { CATEGORIES } from '../../core/categories.enum';


export interface ExpenseForm {
  title: FormControl<string>;
  sum: FormControl<number | undefined>;
  categoryId: FormControl<string>;
}

export interface AddExpensesForm {
  shop: FormControl<string>;
  expenses: FormArray<FormGroup<ExpenseForm>>;
}

@Component( {
  standalone: true,
  selector: 'app-add-expenses-form',
  templateUrl: './add-expenses-form.component.html',
  styleUrl: './add-expenses-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
  ],
} )
export class AddExpensesFormComponent implements OnInit {

  date = input<string>();

  saveExpenses = output<any>();

  readonly shopsService: ShopsService = inject( ShopsService );
  readonly destroyRef: DestroyRef = inject( DestroyRef );
  readonly categoriesService: CategoriesService = inject( CategoriesService );

  addExpenseForm!: FormGroup<AddExpensesForm>;

  selectedDefaultCategory!: string;

  formContainer = viewChild<ElementRef<HTMLFormElement>>( 'form' );

  get expenses(): FormGroup[] {
    return ( this.addExpenseForm.controls.expenses as FormArray ).controls as FormGroup[];
  }

  ngOnInit(): void {
    this.buildForm();
    this.observeForm();
  }

  private buildForm(): void {
    this.addExpenseForm = new FormGroup<AddExpensesForm>( {
      shop: new FormControl<string>( '', { nonNullable: true } ),
      expenses: new FormArray( [ this.expensesGroup() ] )
    } );
  }

  private observeForm(): void {

    this.addExpenseForm.controls.shop.valueChanges
      .pipe(
        takeUntilDestroyed( this.destroyRef )
      )
      .subscribe( shop => {
        if ( shop ) {

          if ( shop === Shops.DRUGS ) {
            this.setCategoryAsMedicine();
            return;
          }

        }
      } );

    this.addExpenseForm.controls.expenses.valueChanges
      .pipe(
        takeUntilDestroyed( this.destroyRef )
      )
      .subscribe( ( value: any ) => {
        if ( value && value.length ) {
          if ( !this.selectedDefaultCategory ) {
            this.selectedDefaultCategory = value[ 0 ]?.categoryId!;
          }
        }
      } );
  }

  removeExpense( idx: number ) {
    this.addExpenseForm.controls.expenses.removeAt( idx );
  }

  addExpense(): void {
    this.addExpenseForm.controls.expenses.push( this.expensesGroup() );

    setTimeout( () => {
      this.formContainer()!.nativeElement!.scrollTop = this.formContainer()?.nativeElement?.scrollHeight!;
    } )
  }

  saveForm(): void {
    this.saveExpenses.emit( this.addExpenseForm.value );
    this.addExpenseForm.reset();
  }

  private setCategoryAsMedicine(): void {
    this.selectedDefaultCategory = CATEGORIES.MEDICINE;
    ( this.addExpenseForm.get( 'expenses' ) as FormArray )
      .controls[ 0 ].get<string>( 'categoryId' )?.setValue( CATEGORIES.MEDICINE );
  }

  private expensesGroup(): FormGroup<ExpenseForm> {
    return new FormGroup( {
      title: new FormControl<string>( '', { validators: [ Validators.required ], nonNullable: true } ),
      sum: new FormControl<number | undefined>( undefined, { validators: [ Validators.required ], nonNullable: true } ),
      categoryId: new FormControl<string>( this.selectedDefaultCategory || '', { validators: [], nonNullable: true } ),
    } );
  }

}

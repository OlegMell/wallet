import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ShopsService } from '../../core/features/shops/shops.service';
import { CategoriesService } from '../../core/features/categories/categories.service';


export interface ExpenseForm {
  title: FormControl<string>;
  sum: FormControl<string>;
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
  readonly categoriesService: CategoriesService = inject( CategoriesService );

  addExpenseForm!: FormGroup<AddExpensesForm>;

  get expenses(): FormGroup[] {
    return ( this.addExpenseForm.controls.expenses as FormArray ).controls as FormGroup[];
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.addExpenseForm = new FormGroup<AddExpensesForm>( {
      shop: new FormControl<string>( '', { nonNullable: true } ),
      expenses: new FormArray( [ this.expensesGroup() ] )
    } );
  }

  removeExpense( idx: number ) {
    this.addExpenseForm.controls.expenses.removeAt( idx );
  }

  addExpense(): void {
    this.addExpenseForm.controls.expenses.push( this.expensesGroup() );
  }

  saveForm(): void {
    this.saveExpenses.emit( this.addExpenseForm.value );
    this.addExpenseForm.reset();
  }

  private expensesGroup(): FormGroup<ExpenseForm> {
    return new FormGroup( {
      title: new FormControl<string>( '', { validators: [ Validators.required ], nonNullable: true } ),
      sum: new FormControl<string>( '', { validators: [ Validators.required ], nonNullable: true } ),
      categoryId: new FormControl<string>( '', { validators: [], nonNullable: true } ),
    } );
  }

}

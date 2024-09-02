import dayjs from 'dayjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { CalendarComponent } from "../../components/calendar/calendar.component";
import { ExpensesService } from '../../core/features/expenses/expenses.service';
import { AddExpensesFormComponent } from "../../components/add-expenses-form/add-expenses-form.component";
import { Expense } from '../../core/interfaces/expense.interface';
import { ExpensesListComponent } from "../../components/expenses-list/expenses-list.component";


@Component( {
  standalone: true,
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarComponent,
    AddExpensesFormComponent,
    ExpensesListComponent
  ],
} )
export class MainComponent {

  private readonly expensesService: ExpensesService = inject( ExpensesService );
  private readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );

  selectedDate!: dayjs.Dayjs;
  showAddExpensesForm: any;
  today = dayjs().format( 'DD.MM.YYYY' );

  expenses: Expense[] = [];

  handleSelectedDate( date: dayjs.Dayjs ) {
    this.selectedDate = date;
    this.fetchExpensesByDate( date );
  }

  private fetchExpensesByDate( date: dayjs.Dayjs ) {
    this.expensesService.fetchByDate( `${ date.format( 'DD.MM.YYYY' ) }` )
      .subscribe( ( expenses: Expense[] ) => {
        console.log( '[expenses]', expenses );
        this.expenses = expenses;
        this.cd.markForCheck();
      } );
  }

  handleSaveExpenses( formValue: any ) {
    this.expensesService.create( formValue )
      .subscribe( ( ) => {
        this.showAddExpensesForm = false;
        this.fetchExpensesByDate( this.selectedDate || dayjs() );
      } );
  }


}
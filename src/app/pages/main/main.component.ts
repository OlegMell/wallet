import dayjs from 'dayjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit, viewChild } from '@angular/core';

import { CalendarComponent } from "../../components/calendar/calendar.component";
import { ExpensesService } from '../../core/features/expenses/expenses.service';
import { AddExpensesFormComponent } from "../../components/add-expenses-form/add-expenses-form.component";
import { Expense } from '../../core/interfaces/expense.interface';
import { ExpensesListComponent } from "../../components/expenses-list/expenses-list.component";
import { isTouchDevice } from '../../core/utilities';
import { AuthService } from '../../core/features/auth/auth.service';


@Component( {
  standalone: true,
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarComponent,
    AddExpensesFormComponent,
    ExpensesListComponent
  ],
} )
export class MainComponent implements OnInit {

  private readonly expensesService: ExpensesService = inject( ExpensesService );
  readonly authService: AuthService = inject( AuthService );
  private readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );

  selectedDate: dayjs.Dayjs = dayjs();

  calendar = viewChild<CalendarComponent>( 'calendar' );

  showAddExpensesForm!: boolean;
  showCalendar: boolean = true;

  today = dayjs().format( 'DD.MM.YYYY' );

  expenses: Expense[] = [];

  ngOnInit(): void {


  }

  handleShowCalendarClick() {
    if ( isTouchDevice() ) {
      this.calendar()!.collapseCalendar = false;
      this.calendar()!.cd.markForCheck();
    }
  }

  handleSelectedDate( date: dayjs.Dayjs ) {
    this.selectedDate = date;
    this.fetchExpensesByDate( date );
  }

  handleAddExpense(): void {
    this.showAddExpensesForm = !this.showAddExpensesForm;
  }

  private fetchExpensesByDate( date: dayjs.Dayjs ) {
    this.expensesService.fetchByDate( `${ date.format( 'DD.MM.YYYY' ) }` )
      .subscribe( ( expenses: Expense[] ) => {
        this.expenses = expenses;
        this.cd.markForCheck();
      } );

    // this.expensesService.getSumForMonth().subscribe( res => {
    //   console.log( res )
    // } )
  }

  handleSaveExpenses( formValue: any ) {
    this.expensesService.create( formValue, this.selectedDate )
      .subscribe( () => {
        this.showAddExpensesForm = false;
        this.fetchExpensesByDate( this.selectedDate || dayjs() );
      } );
  }

}
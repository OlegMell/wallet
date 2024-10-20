import dayjs from 'dayjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit, viewChild } from '@angular/core';

import { CalendarComponent, DateRange } from "../../components/calendar/calendar.component";
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
  selectedRange: DateRange | undefined;

  get period(): string {
    if ( !this.selectedRange ) {
      return this.selectedDate.format( "DD.MM.YYYY" );
    }
    return `${ this.selectedRange.start.format( 'DD.MM.YYYY' ) } - ${ this.selectedRange.end.format( 'DD.MM.YYYY' ) }`;
  }

  ngOnInit(): void {
  }

  handleShowCalendarClick(): void {
    if ( isTouchDevice() ) {
      this.calendar()!.collapseCalendar = false;
      this.calendar()!.cd.markForCheck();
    }
  }

  handleSelectedDate( date: dayjs.Dayjs ): void {
    this.selectedDate = date;
    this.selectedRange = undefined;
    this.fetchExpensesByDate( date );
  }

  handleSelectedRange( range: DateRange ): void {
    this.selectedRange = range;
    this.fetchExpensesByRange( range );
  }

  handleAddExpense(): void {
    this.showAddExpensesForm = !this.showAddExpensesForm;
  }

  private fetchExpensesByRange( range: DateRange ): void {
    this.expensesService.fetchByRange( range )
      .subscribe( ( expenses: Expense[] ) => {
        this.expenses = expenses;
        this.cd.markForCheck();
      } );
  }

  private fetchExpensesByDate( date: dayjs.Dayjs ): void {
    this.expensesService.fetchByDate( `${ date.format( 'DD.MM.YYYY' ) }` )
      .subscribe( ( expenses: Expense[] ) => {
        this.expenses = expenses;
        this.cd.markForCheck();
      } );
  }

  handleSaveExpenses( formValue: any ) {
    this.expensesService.create( formValue, this.selectedDate )
      .subscribe( () => {
        this.showAddExpensesForm = false;
        this.fetchExpensesByDate( this.selectedDate || dayjs() );
      } );
  }

}
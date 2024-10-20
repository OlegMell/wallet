import dayjs from 'dayjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, output } from '@angular/core';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend( customParseFormat )

import { Month, Week, WeekDay } from '../../core/consts';
import { DayComponent } from "./components/day/day.component";
import { isTouchDevice } from '../../core/utilities';


export interface DateRange {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs
};


@Component( {
    standalone: true,
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ DayComponent ]
} )
export class CalendarComponent implements OnInit {

    readonly cd: ChangeDetectorRef = inject( ChangeDetectorRef );

    days: string[] = [];

    months: string[] = Month;
    week: string[] = Week;

    currentDate: dayjs.Dayjs = dayjs();

    selectedDate = output<dayjs.Dayjs>();
    selectedRange = output<DateRange>();
    collapseCalendar: boolean = false;

    range: { start: dayjs.Dayjs; end: dayjs.Dayjs } | undefined;

    get currentMonth(): string {
        return this.months[ this.currentDate.month() ];
    }

    get today(): string {
        return dayjs().format();
    }

    get yesterday(): string {
        return dayjs().subtract( 1, 'day' ).format();
    }

    get theDayBeforeYesterday(): string {
        return dayjs().subtract( 2, 'day' ).format();
    }

    ngOnInit(): void {
        this.buildDays();
        this.selectDay( dayjs().format() );
    }

    nextMonth(): void {
        this.currentDate = this.currentDate.add( 1, 'month' );
        this.buildDays();
    }

    prevMonth(): void {
        this.currentDate = this.currentDate.subtract( 1, 'month' );
        this.buildDays();
    }

    selectDay( selectedDay: string ) {
        // if ( isTouchDevice() ) {
        //     this.collapseCalendar = true;
        // }

        if ( this.range && this.range.start && dayjs( selectedDay ).isAfter( this.range.start ) ) {
            this.range.end = dayjs( selectedDay );
            this.selectedRange.emit( this.range );
            return;
        }

        this.selectedDate.emit( dayjs( selectedDay ) );
    }

    rangeStart( date: string ) {

        if ( this.range?.start ) {
            this.range = undefined;
            return;
        }

        this.range = {
            start: dayjs( date ),
            end: dayjs()
        };
    }

    private buildDays(): void {
        this.days = this.getMonthDays( this.currentDate );
        this.addDaysInBegining();
        this.addDaysInEnd();
    }

    private addDaysInBegining(): void {
        const start = this.currentDate.startOf( 'month' );

        if ( start.day() !== WeekDay.MONDAY ) {
            const prevMonth = this.currentDate.subtract( 1, 'month' );

            const tmp: string[] = this.getMonthDays( prevMonth );
            tmp.reverse();

            let offest = start.day() === WeekDay.SUNDAY ? 7 : start.day() === WeekDay.SATURDAY ? 6 : start.day();
            for ( let i = 0; i < offest - 1; i++ ) {
                this.days.splice( 0, 0, tmp[ i ] );
            }
        }
    }

    private addDaysInEnd(): void {
        const end = this.currentDate.endOf( 'month' );

        if ( end.day() !== WeekDay.SUNDAY ) {
            const nextMonth = this.currentDate.add( 1, 'month' );

            const tmp: string[] = this.getMonthDays( nextMonth );

            let offest = end.day();
            for ( let i = 0; i < 7 - offest; i++ ) {
                this.days.splice( this.days.length, 0, tmp[ i ] );
            }
        }
    }

    private getMonthDays( date: dayjs.Dayjs ): string[] {
        let days: string[] = [];

        for ( let i = 1; i <= date.daysInMonth(); i++ ) {
            days.push( dayjs( `${ date.month() + 1 }/${ i }/${ date.year() }` ).format() );
        }

        return days;
    }

}
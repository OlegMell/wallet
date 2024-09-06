import dayjs from 'dayjs';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { Weekends } from '../../../../core/consts';

dayjs.extend( customParseFormat );

@Component( {
    selector: 'app-day',
    standalone: true,
    templateUrl: './day.component.html',
    styleUrl: './day.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class DayComponent {
    date = input.required<string>();

    currentDate = input.required<dayjs.Dayjs>();

    clicked = output<string>();

    get isFutureDate(): boolean {
        return dayjs( this.date() ).isAfter( dayjs(), 'date' );
    }

    get isAnotherMonth(): boolean {
        return !dayjs( this.date() ).isSame( this.currentDate(), 'month' );
    }

    get isWeekend(): boolean {
        return Weekends.includes( dayjs( this.date() ).day() );
    }

    get isToday(): boolean {
        return dayjs().isSame( dayjs( this.date() ), 'date' );
    }

    get day() {
        return dayjs( this.date() ).date();
    }

    handleClick() {
        this.clicked.emit( this.date() );
    }
}
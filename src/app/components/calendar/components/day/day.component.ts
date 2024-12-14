import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Weekends } from '../../../../core/consts';

dayjs.extend(customParseFormat);

@Component({
  standalone: true,
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent {

  date = input.required<string>();

  currentDate = input.required<dayjs.Dayjs>();

  rangeStartDate = input.required<dayjs.Dayjs | undefined>();
  rangeEndDate = input.required<dayjs.Dayjs | undefined>();

  clicked = output<string>();
  rangeStart = output<string>();

  get isRangeStart(): boolean {
    if (this.rangeStartDate()) {
      return dayjs(this.date()).isSame(this.rangeStartDate());
    }
    return false;
  }

  get isRangeEnd(): boolean {
    if (this.rangeEndDate()) {
      return dayjs(this.date()).isSame(this.rangeEndDate());
    }
    return false;
  }

  get isInRange(): boolean {
    if (this.rangeStartDate() && this.rangeEndDate()) {
      return dayjs(this.date()).isAfter(this.rangeStartDate())
        && dayjs(this.date()).isBefore(this.rangeEndDate());
    }
    return false;
  }

  get isFutureDate(): boolean {
    return dayjs(this.date()).isAfter(dayjs(), 'date');
  }

  get isAnotherMonth(): boolean {
    return !dayjs(this.date()).isSame(this.currentDate(), 'month');
  }

  get isWeekend(): boolean {
    return Weekends.includes(dayjs(this.date()).day());
  }

  get isToday(): boolean {
    return dayjs().isSame(dayjs(this.date()), 'date');
  }

  get day(): number {
    return dayjs(this.date()).date();
  }

  handleClick(): void {
    this.clicked.emit(this.date());
  }

  handleDblClick(): void {
    this.rangeStart.emit(this.date());
  }
}

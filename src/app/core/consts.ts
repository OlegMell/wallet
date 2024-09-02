export const Month: string[] = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

export const Week: string[] = [
    'Пн',
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
    "Нд"
];

export enum WeekDay {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 0,
}

export const Weekends: WeekDay[] = [
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
];
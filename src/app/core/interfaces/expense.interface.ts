import { FireBaseId } from '../types/firebase-id.type';

export interface Expense {
    id: FireBaseId;
    date: number;
    title: string;
    sum: string;
    categoryId: string;
    userId: string;
    shopId: string;
    description: string;
}
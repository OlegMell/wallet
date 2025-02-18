import { FireBaseId } from '../types/firebase-id.type';

export interface Expense {
    id: FireBaseId;
    date: string;
    title: string;
    sum: number;
    categoryId: string;
    userId: string;
    shopId: string;
    description: string;
}
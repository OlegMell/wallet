import { FireBaseId } from '../types/firebase-id.type';

export interface Category {
    readonly id: FireBaseId;
    readonly title: string;
    readonly owner?: string;
}
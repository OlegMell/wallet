import { FireBaseId } from '../types/firebase-id.type';

export interface Shop {
    readonly id: FireBaseId;
    readonly title: string;
}
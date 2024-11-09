import { FireBaseId } from '../types/firebase-id.type';

export interface Budget {
  categories: FireBaseId[];
  income: number;
  outcome: number;
  owner: FireBaseId;
  name?: string;
}

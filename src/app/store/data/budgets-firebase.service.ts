import { EMPTY, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  where
} from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';

import { FireBaseService } from './firebase-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Budget } from '../../core/interfaces/budget.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetsFirebaseService implements FireBaseService<Budget> {

  private readonly store: Firestore = inject(Firestore);

  private readonly budgetsCollection = collection(this.store, 'budgets');

  getAllByUserId(ownerId: FireBaseId): Observable<QuerySnapshot> {
    const q = query(this.budgetsCollection, where("owner", "==", ownerId));
    return from(getDocs(q));
  }

  getOne(id: FireBaseId): Observable<Budget> {
    return EMPTY;
  }

  getBy(...queryFilter: QueryFieldFilterConstraint[]): Observable<QuerySnapshot> {
    const q = query(this.budgetsCollection, ...queryFilter);
    return from(getDocs(q));
  }

  add(budget: Partial<Budget>): Observable<any> {
    const toCreate = { ...budget };
    return from(addDoc(this.budgetsCollection, toCreate));
  }

  update(): Observable<any> {
    return EMPTY;
  }

}

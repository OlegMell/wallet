import { EMPTY, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { RepositoryService } from './repository-service';
import { FireBaseId } from '../../core/types/firebase-id.type';
import { Budget } from '../../core/interfaces/budget.interface';
import { BudgetsFirebaseService } from '../data/budgets-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetsRepository implements RepositoryService<Budget> {

  private readonly service: BudgetsFirebaseService = inject(BudgetsFirebaseService);

  getAll(userId: FireBaseId): Observable<Budget[]> {
    return this.service.getAllByUserId(userId)
      .pipe(map((q) => this.getDataFromQuerySnapshot(q)));
  }

  getOne(id: FireBaseId): Observable<Budget> {
    return EMPTY;
  }

  add(budget: Partial<Budget>): Observable<any> {
    return this.service.add(budget);
  }

  update(): Observable<any> {
    return EMPTY;
  }

  private getDataFromQuerySnapshot<T>(q: QuerySnapshot): T[] {

    if ((q as QuerySnapshot).size) {
      const data: T[] = [];

      (q as QuerySnapshot).forEach((doc: DocumentSnapshot) => {
        data.push(doc.data() as T);
      });

      return data;
    }

    return [];
  }

  private getDataFromAggregatedQuerySnapshot<T>(q: QuerySnapshot): T[] {
    return (q as any).data();
  }

}

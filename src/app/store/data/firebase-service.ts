import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, QuerySnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FireBaseId } from '../../core/types/firebase-id.type';

export interface FireBaseService<T> {

    getAllByUserId( userId?: FireBaseId ): Observable<T[] | QuerySnapshot>;
    getOne( id: FireBaseId ): Observable<T>;
    add( entity: Partial<T> ): Observable<any>;
    update(): Observable<any>;

}
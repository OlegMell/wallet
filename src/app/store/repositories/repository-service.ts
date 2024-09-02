import { Observable } from 'rxjs';

import { FireBaseId } from '../../core/types/firebase-id.type';
import { QuerySnapshot } from 'firebase/firestore';

export interface RepositoryService<T> {
    getAll( userId?: FireBaseId ): Observable<T[] | QuerySnapshot>;
    getOne( id: FireBaseId ): Observable<T>;
    add( entity: any ): Observable<any>;
    update(): Observable<any>;
}
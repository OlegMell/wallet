import { Observable } from 'rxjs';
import { QuerySnapshot } from 'firebase/firestore';

import { FireBaseId } from '../../core/types/firebase-id.type';

export interface RepositoryService<T> {
    getAll( userId?: FireBaseId ): Observable<T[] | QuerySnapshot>;
    getOne( id: FireBaseId ): Observable<T>;
    add( entity: any ): Observable<any>;
    update(): Observable<any>;
}

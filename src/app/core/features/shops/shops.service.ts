import { EMPTY, Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Shop } from '../../interfaces/shop.interface';
import { ShopsRepository } from '../../../store/repositories/shops-repository.service';

@Injectable( {
    providedIn: 'root'
} )
export class ShopsService {

    private readonly authService: AuthService = inject( AuthService );
    private readonly repository: ShopsRepository = inject( ShopsRepository );

    #shops: Observable<Shop[]> = of( [] );

    get shops(): Observable<Shop[]> {
        return this.#shops;
    }

    fetchData(): void {
        this.#shops = this.repository.getAll()
            .pipe(
            // map( ( querySnapshot ) => {
            //     console.log( querySnapshot )
            //     if ( ( querySnapshot as QuerySnapshot ).size ) {
            //         const data: Shop[] = [];

            //         ( querySnapshot as QuerySnapshot ).forEach( ( doc: DocumentSnapshot ) => {
            //             data.push( doc.data() as Shop );
            //         } );

            //         console.log( data )

            //         return data;
            //     }

            //     return [];
            // } )
        );
    }

    clearData(): void {
        this.#shops = EMPTY;
    }

}

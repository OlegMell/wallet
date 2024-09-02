import { inject, Injectable } from '@angular/core';
import { from, switchMap, tap } from 'rxjs';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { UsersRepository } from '../../../store/repositories/users-repository.service';


@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    private readonly auth = inject( Auth );
    private readonly usersRepository: UsersRepository = inject( UsersRepository );

    private readonly provider = new GoogleAuthProvider();

    authenticatedUser: any;
    fireBaseUser!: DocumentSnapshot;

    get user() {
        return this.auth.currentUser;
    }

    signIn(): any {
        return from( signInWithPopup( this.auth, this.provider ) )
            .pipe(
                tap( ( signInResult ) => this.authenticatedUser = signInResult.user ),
                switchMap( () => this.findUser().pipe(
                    switchMap( ( querySnap: QuerySnapshot ) => {
                        if ( querySnap.size ) {
                            return querySnap.docs;
                        } else {
                            return this.addUser();
                        }
                    } )
                ) ),
                tap( ( user: DocumentSnapshot ) => this.fireBaseUser = user )
            );
    }

    logout(): void {
        signOut( this.auth ).then( () => {
        } )
    }

    private findUser() {
        return this.usersRepository.getOne( this.user?.email! );
    }

    private addUser() {
        return this.usersRepository.add( {
            fullName: this.user?.displayName!,
            email: this.user?.email!
        } );
    }

}
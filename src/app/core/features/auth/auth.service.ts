import { from, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { effect, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, user } from '@angular/fire/auth';

import { UsersRepository } from '../../../store/repositories/users-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly usersRepository: UsersRepository = inject(UsersRepository);

  private readonly provider = new GoogleAuthProvider();

  user$ = user(this.auth);

  currentGoogleUser: Signal<User | undefined | null> = toSignal(this.user$);

  constructor() {
    effect(() => {
      if (this.currentGoogleUser()) {
        this.findUser(this.currentGoogleUser()?.email!)
          .pipe(
            switchMap((querySnap: QuerySnapshot) => {
              if (querySnap.size) {
                return of(querySnap.docs[0]);
              } else {
                return this.addUser();
              }
            })
          ).subscribe((res: DocumentSnapshot) => {
          this.fireBaseUser.set(res);
        })
      }
    });
  }

  authenticatedUser: any;

  fireBaseUser: WritableSignal<DocumentSnapshot | undefined> = signal(undefined)

  get user() {
    return this.auth.currentUser;
  }

  signIn(): any {
    return from(signInWithPopup(this.auth, this.provider))
      .pipe(
        tap((signInResult) => this.authenticatedUser = signInResult.user),
        switchMap(() => this.findUser().pipe(
          switchMap((querySnap: QuerySnapshot) => {
            if (querySnap.size) {
              return querySnap.docs;
            } else {
              return this.addUser();
            }
          })
        )),
        tap((user: DocumentSnapshot) => this.fireBaseUser.set(user))
      );
  }

  logout(): void {
    signOut(this.auth).then(() => {
    })
  }

  findUser(userEmail?: string) {
    return this.usersRepository.getOne(userEmail || this.user?.email!);
  }

  private addUser() {
    return this.usersRepository.add({
      fullName: this.user?.displayName!,
      email: this.user?.email!
    });
  }

}

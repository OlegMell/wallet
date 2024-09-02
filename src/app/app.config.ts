import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import { firebaseConfig } from './core/firebase.config';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ), provideRouter( routes ),
    provideFirebaseApp( () => initializeApp( firebaseConfig ) ),
    provideFirestore( () => getFirestore() ),
    provideAuth( () => getAuth() ),
  ]
};



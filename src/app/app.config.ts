import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode } from '@angular/core';

import { routes } from './app.routes';
import { firebaseConfig } from './core/firebase.config';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ), provideRouter( routes ),
    provideFirebaseApp( () => initializeApp( firebaseConfig ) ),
    provideFirestore( () => getFirestore() ),
    provideAuth( () => getAuth() ),
    provideHttpClient(),
    provideServiceWorker( 'ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    } ),
  ]
};



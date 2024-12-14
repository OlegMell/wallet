import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import { firebaseConfig } from '../../firebase.config';

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



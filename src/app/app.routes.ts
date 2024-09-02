import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import( './pages/main/main.component' ).then( c => c.MainComponent )
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
    }
];

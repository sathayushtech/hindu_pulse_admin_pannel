import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';


export const routes: Routes = [

    { path: 'admin', component: AdminComponent },
    { path: '', redirectTo: '/admin', pathMatch: 'full' } 

];

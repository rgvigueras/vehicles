// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { BrandDetailComponent } from './pages/brand-detail.component/brand-detail.component';
import { BrandsComponent } from './pages/brands.component/brands.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'brands',
    pathMatch: 'full'
  },
  {
    path: 'brands',
    component: BrandsComponent,
  },
  {
    path: 'brands/:id',
    component: BrandDetailComponent,
  },
  {
    path: '**',
    redirectTo: 'brands'
  }
];

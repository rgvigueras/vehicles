import { createAction, props } from '@ngrx/store';
import { Brand, VehicleModel, VehicleType } from '../../core/models/brand.model';

export const loadBrands = createAction('[Brands] Load Brands');
export const loadBrandsSuccess = createAction('[Brands] Load Brands Success', props<{ brands: Brand[] }>());
export const loadBrandsFailure = createAction('[Brands] Load Brands Failure', props<{ error: any }>());

export const loadBrandDetails = createAction('[Brands] Load Brand Details', props<{ makeId: number }>());
export const loadBrandDetailsSuccess = createAction('[Brands] Load Brand Details Success', props<{ makeId: number; models: VehicleModel[]; types: VehicleType[] }>());
export const loadBrandDetailsFailure = createAction('[Brands] Load Brand Details Failure', props<{ error: any }>());

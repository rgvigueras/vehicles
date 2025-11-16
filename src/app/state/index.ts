import { ActionReducerMap } from '@ngrx/store';
import { brandsReducer } from './brands/brands.reducer';
import { BrandsState } from './brands/brands.state';

export interface AppState {
  brands: BrandsState;
}

export const reducers: ActionReducerMap<AppState> = {
  brands: brandsReducer,
};

export * as BrandsActions from './brands/brands.actions';
export * as BrandsSelectors from './brands/brands.selectors';
export * as BrandsEffects from './brands/brands.effects';
export * from './brands/brands.state';

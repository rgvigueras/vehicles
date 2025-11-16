// src/app/state/brands/brands.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as BrandsActions from './brands.actions';
import { adapter, initialState, BrandsState } from './brands.state';

export const brandsReducer = createReducer(
  initialState,

  on(BrandsActions.loadBrands, (state): BrandsState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BrandsActions.loadBrandsSuccess, (state, { brands }): BrandsState =>
    adapter.setAll(brands, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(BrandsActions.loadBrandsFailure, (state, { error }): BrandsState => ({
    ...state,
    loading: false,
    error,
  })),

  on(BrandsActions.loadBrandDetailsSuccess, (state, { makeId, models, types }): BrandsState => ({
    ...state,
    details: {
      ...state.details,
      [makeId]: { models, types, loaded: true },
    },
  })),

  on(BrandsActions.loadBrandDetailsFailure, (state, { error }): BrandsState => ({
    ...state,
    error,
  }))
);

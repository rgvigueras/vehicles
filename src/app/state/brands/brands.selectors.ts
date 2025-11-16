import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BrandsState, adapter } from './brands.state';

export const selectBrandsState = createFeatureSelector<BrandsState>('brands');

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const selectAllBrands = createSelector(
  selectBrandsState,
  selectAll
);

export const selectBrandEntities = createSelector(
  selectBrandsState,
  selectEntities
);

export const selectBrandsCount = createSelector(
  selectBrandsState,
  selectTotal
);

export const selectBrandsLoading = createSelector(
  selectBrandsState,
  (state) => state.loading
);

export const selectBrandsError = createSelector(
  selectBrandsState,
  (state) => state.error
);

export const selectBrandDetailsMap = createSelector(
  selectBrandsState,
  (state) => state.details
);

export const selectIsBrandsLoaded = createSelector(
  selectBrandsState,
  (state) => state.loaded
);

export const selectBrandDetails = (makeId: number) =>
  createSelector(selectBrandsState, (state) => state.details[makeId]);

export const selectBrandModels = (makeId: number) =>
  createSelector(selectBrandDetails(makeId), (details) => details?.models || []);

export const selectBrandTypes = (makeId: number) =>
  createSelector(selectBrandDetails(makeId), (details) => details?.types || []);



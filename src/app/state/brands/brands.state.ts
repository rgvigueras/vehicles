import { VehicleModel, VehicleType, Brand } from "../../core/models/brand.model";
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface BrandDetails {
  models?: VehicleModel[];
  types?: VehicleType[];
  loaded?: boolean;
}

export const adapter = createEntityAdapter<Brand>({
  selectId: (b) => b.Make_ID,
  sortComparer: (a, b) => a.Make_Name.localeCompare(b.Make_Name),
});

export interface BrandsState extends EntityState<Brand> {
  loading: boolean;
  error?: any;
  loaded: boolean;
  details: { [makeId: number]: BrandDetails };
}

export const initialState: BrandsState = adapter.getInitialState({
  loading: false,
  error: null,
  details: {},
  loaded: false,
});

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BrandsActions from './brands.actions';
import { catchError, map, mergeMap, of, forkJoin, withLatestFrom, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { VpicApiService } from '../../core/services/vpic-api.service';
import { selectBrandDetailsMap } from './brands.selectors';

  export const loadBrands$ = createEffect(
    () => {
      const api = inject(VpicApiService);
      const actions$ = inject(Actions);
      return actions$.pipe(
        ofType(BrandsActions.loadBrands),
        mergeMap(() => api.getAllMakes()
          .pipe(
            map(brands => BrandsActions.loadBrandsSuccess({ brands })),
            catchError(error => of(BrandsActions.loadBrandsFailure({ error })))
          ))
      )
  }, {dispatch: true, functional: true}
  );

  export const loadBrandDetails$ = createEffect(
    () => {
      const actions$ = inject(Actions);
      const store = inject(Store);
      const api = inject(VpicApiService);
      return actions$.pipe(
        ofType(BrandsActions.loadBrandDetails),
        withLatestFrom(store.select(selectBrandDetailsMap)),
        filter(([action, detailsMap]) => !detailsMap[action.makeId]?.loaded),
        mergeMap(([action]) =>
        forkJoin({ models: api.getModelsForMakeId(action.makeId),
                   types: api.getVehicleTypesForMakeId(action.makeId)
        }).pipe(
          map(({ models, types }) => BrandsActions.loadBrandDetailsSuccess({ makeId: action.makeId, models, types })),
            catchError(error => of(BrandsActions.loadBrandDetailsFailure({ error })))
          )
        ))
  }, {dispatch: true, functional: true}
);



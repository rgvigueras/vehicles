import { TestBed } from '@angular/core/testing';
import { VpicApiService } from '../../core/services/vpic-api.service';
import * as BrandsActions from './brands.actions';
import { Brand, VehicleModel, VehicleType } from '../../core/models/brand.model';
import { of, throwError } from 'rxjs';

describe('BrandsEffects', () => {
  let mockVpicApiService: jasmine.SpyObj<VpicApiService>;

  const mockBrands: Brand[] = [
    { Make_ID: 1, Make_Name: 'BMW' },
    { Make_ID: 2, Make_Name: 'Mercedes' },
    { Make_ID: 3, Make_Name: 'Audi' }
  ];

  const mockModels: VehicleModel[] = [
    { Make_ID: 1, Make_Name: 'BMW', Model_ID: 1, Model_Name: 'X5' },
    { Make_ID: 1, Make_Name: 'BMW', Model_ID: 2, Model_Name: 'X3' }
  ];

  const mockTypes: VehicleType[] = [
    { MakeID: 1, MakeName: 'BMW', VehicleTypeId: 1, VehicleTypeName: 'SUV' },
    { MakeID: 1, MakeName: 'BMW', VehicleTypeId: 2, VehicleTypeName: 'Sedan' }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('VpicApiService', [
      'getAllMakes',
      'getModelsForMakeId', 
      'getVehicleTypesForMakeId'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: VpicApiService, useValue: spy }
      ]
    });

    mockVpicApiService = TestBed.inject(VpicApiService) as jasmine.SpyObj<VpicApiService>;
  });

  describe('BrandsActions', () => {
    it('should create loadBrands action', () => {
      const action = BrandsActions.loadBrands();
      expect(action.type).toBe('[Brands] Load Brands');
    });

    it('should create loadBrandsSuccess action', () => {
      const action = BrandsActions.loadBrandsSuccess({ brands: mockBrands });
      expect(action.type).toBe('[Brands] Load Brands Success');
      expect(action.brands).toEqual(mockBrands);
    });

    it('should create loadBrandsFailure action', () => {
      const error = new Error('Test error');
      const action = BrandsActions.loadBrandsFailure({ error });
      expect(action.type).toBe('[Brands] Load Brands Failure');
      expect(action.error).toBe(error);
    });

    it('should create loadBrandDetails action', () => {
      const makeId = 123;
      const action = BrandsActions.loadBrandDetails({ makeId });
      expect(action.type).toBe('[Brands] Load Brand Details');
      expect(action.makeId).toBe(makeId);
    });

    it('should create loadBrandDetailsSuccess action', () => {
      const makeId = 123;
      const action = BrandsActions.loadBrandDetailsSuccess({ 
        makeId, 
        models: mockModels, 
        types: mockTypes 
      });
      expect(action.type).toBe('[Brands] Load Brand Details Success');
      expect(action.makeId).toBe(makeId);
      expect(action.models).toEqual(mockModels);
      expect(action.types).toEqual(mockTypes);
    });

    it('should create loadBrandDetailsFailure action', () => {
      const error = new Error('Test error');
      const action = BrandsActions.loadBrandDetailsFailure({ error });
      expect(action.type).toBe('[Brands] Load Brand Details Failure');
      expect(action.error).toBe(error);
    });
  });

  describe('VpicApiService integration', () => {
    it('should call getAllMakes successfully', (done) => {
      mockVpicApiService.getAllMakes.and.returnValue(of(mockBrands));

      mockVpicApiService.getAllMakes().subscribe(brands => {
        expect(brands).toEqual(mockBrands);
        expect(mockVpicApiService.getAllMakes).toHaveBeenCalled();
        done();
      });
    });

    it('should call getModelsForMakeId successfully', (done) => {
      const makeId = 1;
      mockVpicApiService.getModelsForMakeId.and.returnValue(of(mockModels));

      mockVpicApiService.getModelsForMakeId(makeId).subscribe(models => {
        expect(models).toEqual(mockModels);
        expect(mockVpicApiService.getModelsForMakeId).toHaveBeenCalledWith(makeId);
        done();
      });
    });

    it('should call getVehicleTypesForMakeId successfully', (done) => {
      const makeId = 1;
      mockVpicApiService.getVehicleTypesForMakeId.and.returnValue(of(mockTypes));

      mockVpicApiService.getVehicleTypesForMakeId(makeId).subscribe(types => {
        expect(types).toEqual(mockTypes);
        expect(mockVpicApiService.getVehicleTypesForMakeId).toHaveBeenCalledWith(makeId);
        done();
      });
    });

    it('should handle getAllMakes error', (done) => {
      const error = new Error('API Error');
      mockVpicApiService.getAllMakes.and.returnValue(throwError(() => error));

      mockVpicApiService.getAllMakes().subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });

    it('should handle getModelsForMakeId error', (done) => {
      const makeId = 1;
      const error = new Error('API Error');
      mockVpicApiService.getModelsForMakeId.and.returnValue(throwError(() => error));

      mockVpicApiService.getModelsForMakeId(makeId).subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });

    it('should handle getVehicleTypesForMakeId error', (done) => {
      const makeId = 1;
      const error = new Error('API Error');
      mockVpicApiService.getVehicleTypesForMakeId.and.returnValue(throwError(() => error));

      mockVpicApiService.getVehicleTypesForMakeId(makeId).subscribe({
        next: () => fail('Expected an error'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        }
      });
    });
  });
});
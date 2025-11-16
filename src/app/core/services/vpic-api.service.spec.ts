import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { VpicApiService } from './vpic-api.service';

describe('VpicApiService', () => {
  let service: VpicApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VpicApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(VpicApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMakes', () => {
    it('should return an Observable<Brand[]>', async () => {
      const mockResponse = {
        Results: [
          { Make_ID: 1, Make_Name: 'BMW' },
          { Make_ID: 2, Make_Name: 'Mercedes' },
          { Make_ID: 3, Make_Name: 'Audi' },
        ],
      };

      const promise = firstValueFrom(service.getAllMakes());
      const req = httpMock.expectOne(`${baseUrl}/getallmakes?format=json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const brands = await promise;
      expect(brands.length).toBe(3);
      expect(brands[0].Make_Name).toBe('BMW');
      expect(brands[1].Make_Name).toBe('Mercedes');
      expect(brands[2].Make_Name).toBe('Audi');
    });

    it('should handle empty results', async () => {
      const promise = firstValueFrom(service.getAllMakes());
      const req = httpMock.expectOne(`${baseUrl}/getallmakes?format=json`);
      req.flush({ Results: [] });

      const brands = await promise;
      expect(brands.length).toBe(0);
    });

    it('should handle HTTP errors', async () => {
      const promise = firstValueFrom(service.getAllMakes().pipe());
      const req = httpMock.expectOne(`${baseUrl}/getallmakes?format=json`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expectAsync(promise).toBeRejected();
    });
  });

  describe('getModelsForMakeId', () => {
    it('should return an Observable<VehicleModel[]> for a given makeId', async () => {
      const makeId = 123;
      const mockResponse = {
        Results: [
          { Make_ID: 123, Make_Name: 'BMW', Model_ID: 1, Model_Name: 'X5' },
          { Make_ID: 123, Make_Name: 'BMW', Model_ID: 2, Model_Name: 'X3' },
          { Make_ID: 123, Make_Name: 'BMW', Model_ID: 3, Model_Name: '3 Series' },
        ],
      };

      const promise = firstValueFrom(service.getModelsForMakeId(makeId));
      const req = httpMock.expectOne(`${baseUrl}/getmodelsformakeId/${makeId}?format=json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const models = await promise;
      expect(models.length).toBe(3);
      expect(models[0].Model_Name).toBe('X5');
      expect(models[1].Model_Name).toBe('X3');
      expect(models[2].Model_Name).toBe('3 Series');
    });

    it('should handle empty models result', async () => {
      const makeId = 999;
      const promise = firstValueFrom(service.getModelsForMakeId(makeId));
      const req = httpMock.expectOne(`${baseUrl}/getmodelsformakeId/${makeId}?format=json`);
      req.flush({ Results: [] });

      const models = await promise;
      expect(models.length).toBe(0);
    });
  });

  describe('getVehicleTypesForMakeId', () => {
    it('should return an Observable<VehicleType[]> for a given makeId', async () => {
      const makeId = 456;
      const mockResponse = {
        Results: [
          { MakeID: 456, MakeName: 'Mercedes', VehicleTypeId: 1, VehicleTypeName: 'Sedan' },
          { MakeID: 456, MakeName: 'Mercedes', VehicleTypeId: 2, VehicleTypeName: 'SUV' },
          { MakeID: 456, MakeName: 'Mercedes', VehicleTypeId: 3, VehicleTypeName: 'Coupe' },
        ],
      };

      const promise = firstValueFrom(service.getVehicleTypesForMakeId(makeId));
      const req = httpMock.expectOne(`${baseUrl}/GetVehicleTypesForMakeId/${makeId}?format=json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const types = await promise;
      expect(types.length).toBe(3);
      expect(types[0].VehicleTypeName).toBe('Sedan');
      expect(types[1].VehicleTypeName).toBe('SUV');
      expect(types[2].VehicleTypeName).toBe('Coupe');
    });

    it('should handle empty vehicle types result', async () => {
      const makeId = 999;
      const promise = firstValueFrom(service.getVehicleTypesForMakeId(makeId));
      const req = httpMock.expectOne(`${baseUrl}/GetVehicleTypesForMakeId/${makeId}?format=json`);
      req.flush({ Results: [] });

      const types = await promise;
      expect(types.length).toBe(0);
    });

    it('should handle HTTP errors for getVehicleTypesForMakeId', async () => {
      const makeId = 123;
      const promise = firstValueFrom(service.getVehicleTypesForMakeId(makeId));
      const req = httpMock.expectOne(`${baseUrl}/GetVehicleTypesForMakeId/${makeId}?format=json`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejected();
    });
  });

  describe('URL construction', () => {
    it('should construct correct URLs for different endpoints', async () => {
      const promise1 = firstValueFrom(service.getAllMakes());
      const req1 = httpMock.expectOne(`${baseUrl}/getallmakes?format=json`);
      req1.flush({ Results: [] });
      await promise1;

      const makeId = 100;
      const promise2 = firstValueFrom(service.getModelsForMakeId(makeId));
      const req2 = httpMock.expectOne(`${baseUrl}/getmodelsformakeId/${makeId}?format=json`);
      req2.flush({ Results: [] });
      await promise2;

      const promise3 = firstValueFrom(service.getVehicleTypesForMakeId(makeId));
      const req3 = httpMock.expectOne(`${baseUrl}/GetVehicleTypesForMakeId/${makeId}?format=json`);
      req3.flush({ Results: [] });
      await promise3;
    });
  });
});

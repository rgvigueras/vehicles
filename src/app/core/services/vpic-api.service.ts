import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Brand, VehicleModel, VehicleType } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class VpicApiService {
  private base = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  private http = inject(HttpClient);

  getAllMakes(): Observable<Brand[]> {
    const url = `${this.base}/getallmakes`;
    return this.http.get<any>(url, { params: new HttpParams().set('format','json') })
      .pipe(map(res => res.Results as Brand[]));
  }

  getModelsForMakeId(makeId: number): Observable<VehicleModel[]> {
    const url = `${this.base}/getmodelsformakeId/${makeId}`;
    return this.http.get<any>(url, { params: new HttpParams().set('format','json') })
      .pipe(map(res => res.Results as VehicleModel[]));
  }

  getVehicleTypesForMakeId(makeId: number): Observable<VehicleType[]> {
    const url = `${this.base}/GetVehicleTypesForMakeId/${makeId}`;
    return this.http.get<any>(url, { params: new HttpParams().set('format','json') })
      .pipe(map(res => res.Results as VehicleType[]));
  }
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BrandsComponent } from './brands.component';
import { BrandsActions } from '../../state';
import { Brand } from '../../core/models/brand.model';
import { selectAllBrands, selectIsBrandsLoaded } from '../../state/brands/brands.selectors';

describe('BrandsComponent', () => {
  let component: BrandsComponent;
  let fixture: ComponentFixture<BrandsComponent>;
  let store: MockStore;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBrands: Brand[] = [
    { Make_ID: 1, Make_Name: 'BMW' },
    { Make_ID: 2, Make_Name: 'Mercedes' },
    { Make_ID: 3, Make_Name: 'Audi' },
    { Make_ID: 4, Make_Name: 'Toyota' }
  ];

  const initialState = {
    brands: {
      entities: {
        1: mockBrands[0],
        2: mockBrands[1],
        3: mockBrands[2],
        4: mockBrands[3]
      },
      ids: [1, 2, 3, 4],
      loading: false,
      loaded: false,
      error: null,
      details: {}
    }
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BrandsComponent
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BrandsComponent);
    component = fixture.componentInstance;

    // Override selectors with proper values
    store.overrideSelector(selectAllBrands, mockBrands);
    store.overrideSelector(selectIsBrandsLoaded, false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadBrands action on init when not loaded', () => {
    spyOn(store, 'dispatch');
    store.overrideSelector(selectIsBrandsLoaded, false);
    store.refreshState();
    
    fixture.detectChanges();
    
    expect(store.dispatch).toHaveBeenCalledWith(BrandsActions.loadBrands());
  });

  it('should not dispatch loadBrands action on init when already loaded', () => {
    spyOn(store, 'dispatch');
    store.overrideSelector(selectIsBrandsLoaded, true);
    store.refreshState();
    
    fixture.detectChanges();
    
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should initialize with brands from store', async () => {
    await fixture.whenStable().then(() => {
      expect(component.brands()).toEqual(mockBrands);
    });
  });

  it('should initialize search control with empty string', () => {
    expect(component.searchCtrl.value).toBe('');
  });

  it('should filter brands based on search query', fakeAsync(async () => {
    fixture.detectChanges();
    
    component.searchCtrl.setValue('bmw');
    await fixture.whenStable();
    fixture.detectChanges();
    
    const filteredResult = component.filteredBrands();
    expect(filteredResult).toEqual([{ Make_ID: 1, Make_Name: 'BMW' }]);
  }));

  it('should filter brands case-insensitively', fakeAsync(async() => {
    fixture.detectChanges();
    
    component.searchCtrl.setValue('MERCEDES');
    await fixture.whenStable();
    fixture.detectChanges();
    
    const filteredResult = component.filteredBrands();
    expect(filteredResult).toEqual([{ Make_ID: 2, Make_Name: 'Mercedes' }]);
  }));

  it('should return empty array when search matches no brands', fakeAsync(async () => {
    fixture.detectChanges();
    
    component.searchCtrl.setValue('NonExistentBrand');
    await fixture.whenStable();
    fixture.detectChanges();
    
    const filteredResult = component.filteredBrands();
    expect(filteredResult).toEqual([]);
  }));

  it('should navigate to brand detail when openBrand is called', () => {
    const testBrand = { Make_ID: 123, Make_Name: 'Test Brand' };
    component.openBrand(testBrand);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brand', 123]);
  });

  it('should handle partial search matches', fakeAsync(async() => {
    fixture.detectChanges();
    
    component.searchCtrl.setValue('m'); // Should match BMW and Mercedes
    await fixture.whenStable();
    fixture.detectChanges();
    
    const filteredResult = component.filteredBrands();
    expect(filteredResult.length).toBe(2);
    expect(filteredResult).toContain({ Make_ID: 1, Make_Name: 'BMW' });
    expect(filteredResult).toContain({ Make_ID: 2, Make_Name: 'Mercedes' });
  }));

  it('should handle empty search by showing all brands', fakeAsync(() => {
    fixture.detectChanges();
    
    component.searchCtrl.setValue('test');
    tick(200);
    fixture.detectChanges();
    
    // Clear search
    component.searchCtrl.setValue('');
    tick(200);
    fixture.detectChanges();
    
    const filteredResult = component.filteredBrands();
    expect(filteredResult).toEqual(mockBrands);
  }));
});

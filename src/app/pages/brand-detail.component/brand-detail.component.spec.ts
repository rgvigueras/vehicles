import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { BrandDetailComponent } from './brand-detail.component';
import { BrandsActions } from '../../state';

describe('BrandDetailComponent', () => {
  let component: BrandDetailComponent;
  let fixture: ComponentFixture<BrandDetailComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'selectSignal']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    // Mock selectSignal to return a signal
    mockStore.selectSignal.and.returnValue(signal(undefined));

    await TestBed.configureTestingModule({
      imports: [
        BrandDetailComponent,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize makeId from route params', () => {
    fixture.detectChanges();
    expect(component.makeId).toBe(123);
  });

  it('should dispatch loadBrandDetails action on init', () => {
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      BrandsActions.loadBrandDetails({ makeId: 123 })
    );
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should get details signal from store', () => {
    fixture.detectChanges();
    expect(mockStore.selectSignal).toHaveBeenCalled();
    expect(component.details).toBeDefined();
  });
});

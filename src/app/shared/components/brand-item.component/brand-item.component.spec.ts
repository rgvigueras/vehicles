import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrandItemComponent } from './brand-item.component';
import { Brand } from '../../../core/models/brand.model';

describe('BrandItemComponent', () => {
  let component: BrandItemComponent;
  let fixture: ComponentFixture<BrandItemComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;

  const mockBrand: Brand = {
    Make_ID: 123,
    Make_Name: 'Test Brand'
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BrandItemComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandItemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    
    component.brand = mockBrand;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require brand input', () => {
    expect(component.brand).toBeDefined();
    expect(component.brand).toEqual(mockBrand);
  });

  it('should display brand name in template', () => {
    const cardTitle = debugElement.query(By.css('mat-card-title'));
    expect(cardTitle).toBeTruthy();
    expect(cardTitle.nativeElement.textContent.trim()).toBe('Test Brand');
  });

  it('should have a details button', () => {
    const button = debugElement.query(By.css('button[mat-raised-button]'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Ver detalles');
  });

  it('should navigate to brand details when goToDetails is called', () => {
    component.goToDetails();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands', 123]);
  });

  it('should navigate to brand details when button is clicked', () => {
    const button = debugElement.query(By.css('button[mat-raised-button]'));
    
    button.nativeElement.click();
    fixture.detectChanges();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands', 123]);
  });

  it('should have correct CSS classes', () => {
    const matCard = debugElement.query(By.css('mat-card'));
    expect(matCard.nativeElement.classList).toContain('brand-item');
  });

  it('should have primary color button', () => {
    const button = debugElement.query(By.css('button[mat-raised-button]'));
    expect(button.nativeElement.getAttribute('color')).toBe('primary');
  });
});

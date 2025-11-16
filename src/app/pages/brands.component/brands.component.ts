import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, combineLatestWith, map } from 'rxjs/operators';
import { selectAllBrands, selectIsBrandsLoaded } from '../../state/brands/brands.selectors';
import * as BrandsActions from '../../state/brands/brands.actions';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import { BrandItemComponent } from '../../shared/components/brand-item.component/brand-item.component';
import { MatInputModule } from '@angular/material/input';
import { BrandsState } from '../../state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule, 
    ScrollingModule,
    MatToolbarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrandItemComponent, 
    MatInputModule ]
    
  
})
export class BrandsComponent implements OnInit {

  private store: Store = inject(Store<BrandsState>); 
  private router: Router = inject(Router);

  searchCtrl = new FormControl('');
  
  search = toSignal(
    this.searchCtrl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  brands = this.store.selectSignal(selectAllBrands);
  loaded = this.store.selectSignal(selectIsBrandsLoaded);

  filteredBrands = computed(() => {
    const query = (this.search() || '').toLowerCase();
    const allBrands = this.brands();
    return allBrands.filter((brand) =>
      brand.Make_Name.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    if(!this.loaded()) {
      this.store.dispatch(BrandsActions.loadBrands());
    }
  }

  openBrand(brand: { Make_ID: number; Make_Name: string }) {
    this.router.navigate(['/brand', brand.Make_ID]);
  }
}

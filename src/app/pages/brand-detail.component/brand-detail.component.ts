import { Component, OnInit, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { BrandDetails } from '../../state/brands/brands.state';
import { BrandsActions, BrandsSelectors } from '../../state';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-brand-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatAnchor
],
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private store: Store = inject(Store);

  details!: Signal<BrandDetails | undefined>;
  makeId!: number;
  
  ngOnInit(): void {
    this.makeId = Number(this.route.snapshot.paramMap.get('id'));
    this.details = this.store.selectSignal(BrandsSelectors.selectBrandDetails(this.makeId));

    // If not loaded, launch action to load details
    this.store.dispatch(BrandsActions.loadBrandDetails({ makeId: this.makeId }));
  }

   goBack() {
    this.router.navigate(['/']);
  }
}

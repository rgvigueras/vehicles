import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-brand-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './brand-item.component.html',
  styleUrls: ['./brand-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandItemComponent {
  private readonly router: Router = inject(Router);
  @Input() brand!: Brand;

  goToDetails(): void {
    this.router.navigate(['/brands', this.brand.Make_ID]);
  }
}

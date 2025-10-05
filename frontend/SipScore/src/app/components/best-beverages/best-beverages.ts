import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';
import { BeverageCard } from '../beverageCard/beverageCard';

@Component({
  selector: 'app-best-beverages',
  imports: [CommonModule, BeverageCard],
  templateUrl: './best-beverages.html',
  styleUrl: './best-beverages.scss',
})
export class BestBeverages {
  constructor(
    private httpService: HttpService,
    private cdr: ChangeDetectorRef
  ) {}
  bestBeverages: any[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.httpService.getBestBeverages().subscribe((res: any) => {
      this.bestBeverages = res;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}

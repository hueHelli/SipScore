import { Component } from '@angular/core';
import { BeverageCard } from '../beverageCard/beverageCard';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-beverages',
  imports: [BeverageCard, CommonModule],
  templateUrl: './beverages.html',
  styleUrl: './beverages.scss',
})
export class Beverages {
  constructor(private httpService: HttpService) {}
  beverages: any[] = [];

  ngOnInit() {
    console.log('ngOnInit called');
    this.httpService.getBeverages().subscribe((res: any) => {
      this.beverages = res;
      console.log(this.beverages);
    });
  }
}

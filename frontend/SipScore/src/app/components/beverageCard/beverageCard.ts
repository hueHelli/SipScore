import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-beverageCard',
  imports: [CommonModule],
  templateUrl: './beverageCard.html',
  styleUrl: './beverageCard.scss',
})
export class BeverageCard {
  @Input() beverage: any;
}

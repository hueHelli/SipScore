import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { BestBeverages } from '../best-beverages/best-beverages';

@Component({
  selector: 'app-home',
  imports: [BestBeverages],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private httpService: HttpService) {}
}

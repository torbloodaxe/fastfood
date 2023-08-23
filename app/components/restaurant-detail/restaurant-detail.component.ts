import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
})
export class RestaurantDetailComponent  implements OnInit {

  @Input() data: any;
  @Input() isLoading;

  constructor() { }

  ngOnInit() {}

  getCuisines(cuisines: any[]) {
    if(cuisines === undefined) return [];

    return cuisines.join(', ');
  }

}

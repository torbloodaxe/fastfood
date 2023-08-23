import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';

/**
 *
 *
 * @export
 * @class SearchPage
 * @implements {OnInit}
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {
  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurants Record Found'
  };

  isLoading: boolean = false;
  query: any;
  restaurants: any[] =[];
  allRestaurants: any[] = [];
  /**
   *
   */
  constructor(private api: ApiService) { }

  /**
   *
   */
  ngOnInit() {
    setTimeout(()=>{
      this.allRestaurants = this.api.allRestaurants;
      //this.sInput.setFocus();
    },500);
  }

  /**
   *
   * @param event
   */
  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.restaurants = [];
    if(this.query.length > 0) {
      this.isLoading = true;
      setTimeout(async() => {
        this.restaurants = await this.allRestaurants.filter((element: any) => {
          return element.short_name.includes(this.query);
        });
        console.log(this.restaurants);
        this.isLoading = false;
      }, 3000);
    }
  }
}

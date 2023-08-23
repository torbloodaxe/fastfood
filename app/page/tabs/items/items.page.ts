import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { CartService } from '../../../services/cart/cart.service';
import { ApiService } from '../../../services/api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  id: any;
  data: any = {};
  items: any[] = [];
  veg: boolean = false;
  isLoading: boolean;
  cartData: any = {};
  storedData: any = {};
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available',
  };
  restaurants: any[] = [];
  categories: any[] = [];

  allItems: any[] = [];
  cartSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) {}

  /**
   *
   */
  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe((cart) => {
      console.log('cart item', cart);
      if (cart) {
        this.storedData = cart;
        if (cart?.restaurant?.uid === this.id) {
          this.allItems.forEach((element) => {
            cart.items.forEach((el) => {
              if (element.id != el.id) return;
              element.quantity = el.quantity;
            });
          });
          if (this.veg === true)
            this.items = this.allItems.filter((x) => x.veg === true);
          else this.items = [...this.allItems];
        }
      }
    });
    this.route.paramMap.subscribe((paramMap) => {
      console.log('data: ', paramMap);
      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      console.log('id: ', this.id);

      this.getItems();
    });
  }

  /**
   * getCart method return the element that is in the cart
   * @returns
   */
  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  /**
   *This method return the all the food menu for the restaurant
   *
   * @param cuisines
   * @returns String
   */
  getCuisines(cuisines: any[]) {
    //if (cuisines === undefined) return [];

    return cuisines.join(', ');
  }

  /**
   *
   */
  async getItems() {
    try {
      this.isLoading = true;
      this.data = {};
      this.cartData = {};
      this.storedData = {};
      setTimeout(async () => {
        this.allItems = this.api.allItems;
        let data: any = this.api.restaurants1.filter((x) => x.uid === this.id);
        this.data = data[0];
        this.categories = this.api.categories.filter((x) => x.uid === this.id);
        this.allItems = this.allItems.filter((x) => x.uid === this.id);
        this.items = [...this.allItems];
        console.log('restaurant: ', this.data);
        this.cartService.getCartData();
        // let cart: any = await this.getCart();
        // console.log('cart: ', cart);
        // if (cart?.value) {
        //   this.storedData = JSON.parse(cart.value);
        //   console.log('storedData: ', this.storedData);
        //   if (
        //     this.id == this.storedData.restaurant.uid &&
        //     this.allItems.length > 0
        //   ) {
        //     this.allItems.forEach((element: any) => {
        //       this.storedData.items.forEach((el) => {
        //         if (element.id != el.id) return;
        //         element.quantity = el.quantity;
        //       });
        //     });
        //   }
        //   this.cartData.totalItems = this.storedData.totalItems;
        //   this.cartData.totalSum = this.storedData.totalSum;
        // }
        this.isLoading = false;
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
  /**
   *
   * @param event
   */
  vegOnly(event): void {
    console.log(event.detail.checked);

    this.items = [];
    /*
     *
     */
    if (event.detail.checked)
      this.items = this.allItems.filter((x) => x.veg === true);
    else this.items = this.allItems;

    console.log('items ', this.items);
  }

  /**
   *
   */
  quantityAddition(item) {
    const index = this.allItems.findIndex(x => x.id === item.id);
    console.log(index);
    if(!this.allItems[index].quantity || this.allItems[index].quantity == 0) {
      if(!this.storedData.restaurant || (this.storedData.restaurant && this.storedData.restaurant.uid == this.id)) {
        console.log('index item: ', this.allItems);
        this.cartService.quantityAddition(index, this.allItems, this.data);
      } else {
        // alert for clear cart
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.quantityAddition(index, this.allItems, this.data);
    }
  }
  /**
   * quantitySubtract is a method to remove amount of one in quantity for a specific item
   * @param item
   * @param index
   */
  quantitySubtract(item) {
    const index = this.allItems.findIndex(x => x.id === item.id);
    console.log('item page index: ', index)
    this.cartService.quantitySubtract(index);
  }
  /**
   *
   */
  viewCart() {
    if (this.cartData.items && this.cartData.items.length > 0)
      this.cartService.saveCart();
    this.router.navigate([this.router.url + '/cart']);
  }

  /**
   *
   */
  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      console.log('cartData: ', this.data);
      await Preferences.set({
        key: 'cart',
        value: JSON.stringify(this.cartData),
      });
    } catch (e) {
      console.log(e);
    }
  }
}

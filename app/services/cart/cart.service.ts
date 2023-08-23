import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GlobalService } from '../global/global.service';
import { StorageService } from '../storage/storage.service';

/**
 *
 *
 * @export
 * @class CartService
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  model: any = {};
  location: any = {};
  deliveryCharge = 20;
  private _cart = new BehaviorSubject<any>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    private router: Router
  ) {}

  /**
   *
   */
  async getCartData() {
    let data: any = await this.getCart();
    console.log('data: ', data);
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('model: ', this.model);
      await this.calculate();
      this._cart.next(this.model);
    }
  }

  /**
   *
   * @param index
   * @param items
   * @param data
   * @param order
   */
  alertClearCart(index, items, data, order?) {
    this.global.showAlert(
      order
        ? 'Would you like to reset your cart before re-ordering from this restaurant?'
        : 'Your cart contain items from a different restaurant. Would you like to reset your cart before browsing the restaurant?',
      'Items already in Cart',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.clearCart();
            this.model = {};
            if (order) {
              this.orderToCart(order);
            } else this.quantityAddition(index, items, data);
          },
        },
      ]
    );
  }

  /**
   *
   * @param order
   */
  async orderToCart(order) {
    console.log('order: ', order);
    const data = {
      restaurant: order.restaurant,
      items: order.order,
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model: ', this.model);
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'restaurants', order.restaurant_id]);
  }

  /**
   *
   * @param index
   * @param items
   * @param restaurant
   */
  async quantityAddition(index, items?, restaurant?) {
    try {
      console.log('cart service index add:', index);
      if (items) {
        console.log('model: ', this.model);
        this.model.items = [...items];
      }
      if (restaurant) {
        this.model.restaurant = {};
        this.model.restaurant = restaurant;
      }
      console.log('q plus: ', this.model.items[index]);

      if (!this.model.items[index].quantity || this.model.items[index].quantity == 0) {
        this.model.items[index].quantity = 1;
        console.log('Quantity: ' ,this.model.items[index].quantity);
      } else {
        this.model.items[index].quantity += 1; // this.model.items[index].quantity = this.model.items[index].quantity + 1
        console.log('Quantity: ' ,this.model.items[index].quantity);
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   *
   * @param index
   */
  async quantitySubtract(index) {
    console.log('cart service index sub:', this.model.items);
    try {
      if(this.model.items[index].quantity !== 0) {
        this.model.items[index].quantity -= 1; // this.model.items[index].quantity = this.model.items[index].quantity - 1
      } else {
        this.model.items[index].quantity = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  /**
   *
   */
  async calculate() {
    try {
      let item = this.model.items.filter((x) => x.quantity > 0);
      this.model.items = item;
      this.model.totalSum = 0;
      this.model.totalItems = 0;
      this.model.deliveryCharge = 0;
      this.model.grandTotal = 0;
      item.forEach((element) => {
        this.model.totalItems += element.quantity;
        this.model.totalSum += parseFloat(element.price) * parseFloat(element.quantity);
      });
      this.model.deliveryCharge = this.deliveryCharge;
      this.model.totalSum = parseFloat(this.model.totalSum).toFixed(2);
      this.model.grandTotal = (
        parseFloat(this.model.totalSum) + parseFloat(this.model.deliveryCharge)
      ).toFixed(2);
      if (this.model.totalItems == 0) {
        this.model.totalItems = 0;
        this.model.totalSum = 0;
        this.model.grandTotal = 0;
        await this.clearCart();
        this.model = {};
      }
      console.log('cart: ', this.model);
    } catch (e) {
      console.log('error:', e);
    }
  }

  /**
   *
   * @returns
   */
  getCart() {
    return this.storage.getStorage('cart');
  }
  /**
   *
   */
  async clearCart() {
    this.global.showLoader();
    await this.storage.removeStorage('cart');
    this._cart.next(null);
    this.global.hideLoader();
  }

  /**
   *
   * @param model
   */
  saveCart(model?) {
    if (model) this.model = model;
    this.storage.setStorage('cart', JSON.stringify(this.model));
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { OrderService } from '../../../services/order/order.service';
import { GlobalService } from '../../../services/global/global.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  urlCheck: any;
  url: any;
  model: any = {};
  deliveryCharge = 20;
  instruction: any;
  location: any = {};
  cartSub: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private global: GlobalService,
    private cartService: CartService,
    private orderService: OrderService,
  ) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe(cart =>{
      console.log('cart page: ' , cart)
      this.model = cart;
      if(!this.model) this.location ={}
    });
    this.getData();
  }

/**
 *
 */
  async getData(){
    await this.checkUrl();
    this.location = {
      lat: 28.653831,
      lng: 77.188257,
      address: 'Karol Bagh, New Delhi'
    };
    await this.cartService.getCartData();
  }




  /**
   *
   */
  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  /**
   *
   * @param index
   */
  quantityAddition(index) {
    this.cartService.quantityAddition(index);
  }

  /**
   *
   * @param index
   */
  quantitySubtract(index) {
    this.cartService.quantitySubtract(index);
  }

  /**
   *
   */
  addAddress() {}

  /**
   *
   */
  changeAddress() {}

  /**
   *
   */
  async makePayment() {
    try {
      const data = {
        restaurant_id: this.model.restaurant.uid,
        instruction: this.instruction ? this.instruction : '',
        res: this.model.restaurant,
        order: JSON.stringify(this.model.items),
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalSum,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD'
      };
      console.log('order: ', data);
      await this.orderService.placeOrder(data);
      // clear cart ......
      await this.cartService.clearCart();
      this.global.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
    } catch(e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave(){
    console.log('ionViewWillLeave CartPage');
    if(this.model?.items && this.model.items.length > 0 ){
      this.cartService.saveCart();
    }
  }

}

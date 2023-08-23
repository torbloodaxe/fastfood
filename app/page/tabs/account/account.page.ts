import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {

  profile: any = {};
  isLoading: boolean;
  orders: any[] = [];
  ordersSub: Subscription;

  constructor(private orderService: OrderService) { }

  /**
   *
   */
  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      if(order instanceof Array) {
        this.orders = order;
      } else {
        if(order?.delete) {
          this.orders = this.orders.filter(x => x.id != order.id);
        } else if(order?.update) {
          const index = this.orders.findIndex(x => x.id == order.id);
          this.orders[index] = order;
        } else {
          this.orders = this.orders.concat(order);
        }
      }
    }, e => {
      console.log(e);
    });
    this.getData();
  }
  /**
   *
   */
  async getData() {
    this.isLoading = true;
    setTimeout(async () => {
      this.profile = {
        name: 'Nikhil Agarwal',
        phone: '9109109100',
        email: 'technyks@gmail.com'
      };
      await this.orderService.getOrders();
      this.isLoading = false;
    }, 3000);
  }

  logout() {}

  /**
   *
   * @param order
   */
  reorder(order) {
    console.log(order);

  }

  /**
   *
   * @param order
   */
  getHelp(order) {
    console.log(order);
  }

  /**
   *
   */
  ngOnDestroy(): void {
      if(this.ordersSub) this.ordersSub.unsubscribe();
  }

}

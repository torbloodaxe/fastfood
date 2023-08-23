import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';

import { ItemsPage } from './items.page';
import { RestaurantDetailComponent } from '../../../components/restaurant-detail/restaurant-detail.component';
import { ItemComponent} from '../../../components/item/item.component'
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ItemsPage, ItemComponent, RestaurantDetailComponent]
})
export class ItemsPageModule {}

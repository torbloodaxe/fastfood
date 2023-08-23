import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BannerComponent } from '../../../components/banner/banner.component';
import { ComponentsModule } from "../../../components/components.module";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';

/**
 *
 *
 * @export
 * @class HomePage
 * @implements {OnInit,BannerComponent,CommonModule,CommonModule}
 */
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonicModule, BannerComponent, ComponentsModule, CommonModule, RouterLink, RouterModule ],
})

export class HomePage implements OnInit {

  slides: any[] = [];
  restaurants: any[] = [];
  isLoading: boolean = false;

  /**
   *
   */
  constructor(private api: ApiService) {}

  /**
   *
   */
  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.slides = this.api.banners;
      this.restaurants = this.api.restaurants;
      this.isLoading = false;
    }, 3000);
  }

}

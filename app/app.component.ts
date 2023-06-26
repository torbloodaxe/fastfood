import { Component } from '@angular/core';
//import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register swiper custom elements
register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}

import { Injectable } from '@angular/core';
import {
  AlertController,
  IonButton,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isLoading: boolean = false;

  /**
   *
   * @param alertCtl
   */
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  /**
   *
   */
  setLoader() {
    this.isLoading = !this.isLoading;
  }
  /**
   *
   * @param message
   * @param header
   * @param buttonArray
   */
  showAlert(message: string, header?, buttonArray?) {
    this.alertCtrl
      .create({
        header: header ? header : 'Authentication failed',
        message: message,
        buttons: buttonArray ? buttonArray : ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  /**
   *
   * @param msg
   * @param color
   * @param position
   * @param duration
   */
  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  /**
   *
   * @param msg
   * @param color
   * @param position
   * @param duration
   */
  async errorToast(msg?, duration = 4000) {
    this.showToast(
      msg ? msg : 'No Internet Connection',
      'danger',
      'bottom',
      duration
    );
  }

  /**
   *
   * @param msg
   */
  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  /**
   *
   * @param msg
   * @param spinner
   * @returns
   */
  showLoader(msg?, spinner?) {
    if (!this.isLoading) this.setLoader();
    return this.loadingCtrl
      .create({
        message: msg,
        spinner: spinner ? spinner : 'bubbles',
      }).then(res => {
        res.present().then(() => {
          if(!this.isLoading) {
            res.dismiss().then(() => {
              console.log('abort presenting');
            });
          }
        });
      })
      .catch((e) => {
        console.log('show loading error', e);
      });
  }

  /**
   *
   */
  hideLoader() {
    if(this.isLoading) this.setLoader();

    return this.loadingCtrl
      .dismiss()
      .then(() => console.log('dismissed'))
      .catch((e) => console.log('error hide loader: ', e));
  }

  /**
   *S
   * @param options
   * @returns data
   */
  async createModal(options) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data) return data;
  }

  /**
   *
   * @param val
   */
  modalDismiss(val?) {
    let data: any = val ? val : null;
    console.log('data', data);
    this.modalCtrl.dismiss(data);
  }

  /**
   *
   * @param title
   * @returns a string of icon name
   */
  getIcon(title) {
    const name = title.toLowerCase();
    switch (name) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      default:
        return 'location-outline';
    }
  }
}

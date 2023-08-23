import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
/**
 *
 *
 * @export
 * @class AddressService
 */
@Injectable({
  providedIn: 'root'
})

export class AddressService {

  private _addresses = new BehaviorSubject<any>(null);


 /**
  *
  *
  * @readonly
  * @memberof AddressService
  */
 get addresses(){
  return this._addresses.asObservable();
 }

  /**
   *
   * @param api
   */
  constructor(private api: ApiService) { }



  /**
   *
   */
  getAddresses(){
    try{
      //user id
      let allAddress: any[] = this.api.addresses;
      this._addresses.next(allAddress);
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  /**
   *
   * @param param
   */
  async addAddress(param) {}

  /**
   *
   * @param param
   */
  async updateAddress(id, param){

  }

  /**
   *
   * @param id
   */
  async deleteAddress(param){
    param.delete = true;
    this._addresses.next(param);
  }
}

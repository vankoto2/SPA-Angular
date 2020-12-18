import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private user={
    uid:null
  };


  constructor() {
    if(localStorage.getItem('currentUID')){
      this.user.uid = localStorage.getItem('currentUID');
    }
   }

  setUID(uid){
    this.user.uid = uid;
  }

  getUID():string{
    return this.user.uid;
  }
  
}

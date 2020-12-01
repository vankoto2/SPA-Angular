import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SPA-Angular';
  name = 'Ivan';
  
  getNameAlert (myName: string) {
    alert(myName)
  }
  currentValue = "";
  getVal(val: string){
    this.currentValue = val;
    val ='';
  }
}

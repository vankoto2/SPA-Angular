import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';



@NgModule({
  declarations: [LoginComponent, SingupComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoginComponent,
    SingupComponent
  ]
})
export class UserModule { }

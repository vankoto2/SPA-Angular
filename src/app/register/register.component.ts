import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { UtilsService } from '../services/utils.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
/* import { AngularFire, AngularFireAuth, AuthMethods } from '@angular/fire/auth';

import { AngularFire, AuthProviders, AuthMethods } from '@angular/fire'; */

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public signInForm: FormGroup;
  public signUpForm: FormGroup;
  public signInFailed: boolean;
  public userAuth: Subscription;

  constructor(public fb: FormBuilder,public utils:UtilsService, public fs: FirestoreService, public router: Router) {
    this.signInFailed = false;
    this.signInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.signUpForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatpassword:  new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (user) this.router.navigate(['posts']);
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.userAuth) this.userAuth.unsubscribe();
  }

  async signIn(fg: FormGroup) {
    try {
      this.signInFailed = false;
      if (!fg.valid) throw new Error('Invalid sign-in credentials');
      const result = await this.fs.signIn(fg.value.email, fg.value.password);
      //console.log('that tickles', result);
      if (result) this.router.navigate(['posts']);
      else throw new Error('Sign-in failed');
    } catch (error) {
      console.log(error);
      this.signInFailed = true;
    }
  }

  async signUp(fg: FormGroup) {
    try {
        this.signInFailed = false;
        if (!fg.valid) throw new Error('Invalid sign-in credentials');
        if(fg.value.password !== fg.value.repeatpassword) throw new Error('Invalid sign-in credentials');
        const result = await this.fs.signUp(fg.value);
        if (result) {this.router.navigate([ 'profile/'+result ]);
        }
        else throw new Error('Sign-in failed');
    } catch (error) {
        console.log(error);
        this.signInFailed = true;
    }
}
}

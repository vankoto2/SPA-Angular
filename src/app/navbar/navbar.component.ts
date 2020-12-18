import { Component, EventEmitter, OnInit, Output, OnDestroy, ChangeDetectorRef, NgZone, OnChanges } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public userAuth: Subscription;
  public userAuthBool: boolean;
  public console: any;
  public uid: string;

  @Output() isLogout = new EventEmitter<void>();

  constructor(
    public fs: FirestoreService,
    public router: Router,
    private cdRef:ChangeDetectorRef,
    public ngZone:NgZone,
    public utils:UtilsService
    ) {
    this.setUID()
    this.onRender();
  }

  onRender(){
    this.userAuth = this.fs.signedIn.subscribe((user) => this.ngZone.run(()=>{
      this.setUID()
      this.userAuthBool = false;
      if (user) {
        this.userAuthBool = true;
      } else {
        this.userAuthBool = false;
      }
      this.cdRef.detectChanges();
    }));
  }

  setUID(){
    setTimeout(() => this.uid = this.utils.getUID(), 0);
  }

  OnChanges(){
    this.setUID()
  }
 

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.userAuth) this.userAuth.unsubscribe();
  }
  signOut() {
    this.fs.signOut();
    setTimeout(()=>{    this.router.navigate([ 'register' ]);}, 20)
  }
}

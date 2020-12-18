import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})

export class PostsPageComponent implements OnInit, OnDestroy {

  public fsData: Array<any>;
  public userAuth: Subscription;
  public postDataSub: Subscription;
  public activePosts: Array<any>;
  public nonactivePosts: Array<any>;

  constructor(public fs: FirestoreService, public router: Router) { 
    this.fsData = new Array();

    this.userAuth = this.fs.signedIn.subscribe((user) => {
      this.getPostData();
      
    });
  }
  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.userAuth) this.userAuth.unsubscribe();
    if (this.postDataSub) this.postDataSub.unsubscribe();
  }
  
  getPostData() {
    this.postDataSub = this.fs.getPosts().subscribe((data) => {
      this.fsData = data;
      this.activePosts = this.fsData.filter(post=>post.active);
      this.nonactivePosts = this.fsData.filter(post=>{return !(post.active)});
    });
}




}

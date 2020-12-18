import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  nOfAllPosts ;
  nOfActivePosts ;
  postsInfoSub: Subscription;

  constructor(private fs:FirestoreService) { 
    this.postsInfoSub = fs.getPostsInfo().subscribe((users)=>{
      let info:any = users[0];
      this.nOfAllPosts = info.nOfAllPosts;
      this.nOfActivePosts = info.activePosts;
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if(this.postsInfoSub){this.postsInfoSub.unsubscribe()};
  }

}

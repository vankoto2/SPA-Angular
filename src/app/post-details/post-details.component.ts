import { Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  postDataSub : Subscription;
  paramsSub : Subscription;
  postCreatorInfoSub : Subscription;
  userAuth : Subscription;

  public postId: string;
  public currentUID: string;

  public showContacts: boolean;

  public postData;
  public userInformation;
  public rating;
  public userEmail;

  constructor(
    public fs: FirestoreService,
    private _Activatedroute:ActivatedRoute,
    public ngZone:NgZone,
    public utils:UtilsService,
    public router: Router) { 

    this.showContacts = false;

    this.currentUID = this.utils.getUID();
    this.paramsSub=this._Activatedroute.paramMap.subscribe(params=>{
      this.postId = params.get('postId');
      this.postDataSub = this.fs.getPostData(this.postId).valueChanges({ idField:'id'}).subscribe((result)=>{
        this.postData = result;

        this.postCreatorInfoSub = this.fs.getUserPersonalData(this.postData.uid).valueChanges().subscribe((user:any)=>{
          this.userInformation = user;
          this.rating = +user.upVotes/(+user.upVotes+(+user.downVotes))*100;
        })
      })
    });
    this.userAuth = this.fs.signedIn.subscribe((user) => this.ngZone.run(()=>{
      if (user) {
        this.userEmail = user.email;
      } else {
        this.router.navigate([ 'signin' ]);
      }
    })
  );
  }

  async updatePost(post: any,activevalue:boolean) {
    try {
        if (!post) throw new Error('Invalid post');
        const result = await this.fs.updatePost(post.id,activevalue);
        if (!result) throw new Error('Failed to update post');
    } catch (error) {
        console.log(error);
        alert('Failed to update post; something went wrong.');
    }
  }

  async removePost(post: any) {
    try {
        if (!post) throw new Error('Invalid post');
        const result = await this.fs.deletePost(post.id);
        if (!result){ throw new Error('Failed to remove post')}else{
          this.postData = undefined;
          this.router.navigate([ 'posts' ]);
        }
    } catch (error) {
        console.log(error);
        alert('Failed to remove post; something went wrong.');
    }
  }

  ngOnInit(): void {
  }
  /* getPostData() {
    this.postDataSub = this.fs.getPostData().valueChanges().subscribe((data) => {
      this.postData = data;
      console.log(data);
      this.activePosts = this.fsData.filter(post=>post.active);
      this.nonactivePosts = this.fsData.filter(post=>{return !(post.active)});
    }); */

  ngOnDestroy(){
    if(this.paramsSub) this.paramsSub.unsubscribe();
    if(this.postDataSub) this.postDataSub.unsubscribe();
    if(this.postCreatorInfoSub) this.postCreatorInfoSub.unsubscribe();
    if(this.userAuth) this.userAuth.unsubscribe();
  }
}

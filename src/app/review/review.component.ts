import { Component, OnInit, Input, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() data : any;
  @Input('reviewsRaw') reviewsRaw : Array<any>;
  currentUID : any;
  profileInfoSub: Subscription;
  reviewPosterInformation;
  uid;
  editReviewBool;
  public postForm: FormGroup;
  public addFailed: boolean;
  public succesAddReview: boolean;
  public review;
    
    constructor(public fs: FirestoreService,public utils:UtilsService,public ngZone: NgZone,private _Activatedroute:ActivatedRoute,public fb: FormBuilder,) {
    this.postForm = this.fb.group({
      review: new FormControl('', [Validators.required])
    });
    this.editReviewBool = false;
    if(utils.getUID()==null){
      utils.setUID(localStorage.getItem('currentUID'));
    }
    this.currentUID=utils.getUID();
    this.uid=this._Activatedroute.snapshot.paramMap.get("uid");
  }

  ngOnInit(): void {
    this.profileInfoSub = this.fs.getUserPersonalData(this.data.posterId).valueChanges().subscribe((result:any)=>this.ngZone.run(()=>{
      this.reviewPosterInformation = result;
    })) 
    this.review = this.data.review;
  }

  OnDestroy(): void {
    if(this.profileInfoSub){this.profileInfoSub.unsubscribe()};
  }

  editReview(fg: FormGroup){
    if (!fg.valid) throw new Error('Invalid post data');
    this.addFailed = false;
    if(fg.value.review.includes("|")||fg.value.review==""){
      this.addFailed = true;
    }else{
      let {posterId,review} = this.data;
      let currReview = posterId+"|"+review;
      this.succesAddReview = true;
      console.log(this.reviewsRaw);
      console.log(currReview);
      let currRevIndex = this.reviewsRaw.findIndex((element)=>{return element == currReview});
      this.reviewsRaw.splice(currRevIndex,1,posterId+"|"+fg.value.review)
      console.log(this.reviewsRaw);
      this.fs.getUserPersonalData(this.uid).update({reviews:this.reviewsRaw})
    }
    setTimeout(() => {
      this.addFailed = false;
      this.succesAddReview = false;
      this.review = ' ';
    }, 3000);
  }

  deleteReview(){
    let {posterId,review} = this.data;
    let currReview = posterId+"|"+review;
    this.reviewsRaw = this.reviewsRaw.filter(review=>review!=currReview);
    console.log(this.reviewsRaw);
    console.log(this.uid);
    this.fs.getUserPersonalData(this.uid).update({reviews:this.reviewsRaw})
  }

}

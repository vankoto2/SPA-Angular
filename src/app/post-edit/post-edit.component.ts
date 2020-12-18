import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  public postForm: FormGroup;
  public addFailed: boolean;

  public userAuth: Subscription;
  public paramsSub: Subscription;

  public postId;
  public postDataSub: Subscription;
  public postData;

  from;
  to;
  timeOfDeparture;
  nOfSeats;
  luggage;
  details;

  constructor(public fs: FirestoreService,public fb: FormBuilder,public router: Router,public ngZone:NgZone,
    private _Activatedroute:ActivatedRoute
    ) {
    this.addFailed = false;

    this.paramsSub=this._Activatedroute.paramMap.subscribe(params=>{
      this.postId = params.get('postId');
      this.postDataSub = this.fs.getPostData(this.postId).valueChanges({ idField:'id'}).subscribe((result:any)=>{
        this.postData = result;
        this.from = result.from;
        this.to = result.to;
        this.timeOfDeparture = result.timeOfDeparture;
        this.nOfSeats = result.nOfSeats;
        this.luggage = result.luggage;
        this.details = result.details;
      })
    });

    this.postForm = this.fb.group({
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [ Validators.required]),
      timeOfDeparture: new FormControl('', [ Validators.required]),
      nOfSeats: new FormControl('', [ Validators.required]),
      luggage: new FormControl('', [ Validators.required ]),
      details: new FormControl(''),
    }); 
    
    this.userAuth = this.fs.signedIn.subscribe((user) => this.ngZone.run(()=>{
      if (user) {
          
      } else {
          this.router.navigate([ 'signin' ]);
      }
    })
  );
  }
  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.userAuth) this.userAuth.unsubscribe();
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  async addPost(fg: FormGroup) {
    try {
        if (!fg.valid) throw new Error('Invalid post data');
        this.addFailed = false;
        const result = await this.fs.editPost(fg.value,this.postData.id);
        if (result) {
          fg.reset();
          //console.log(result);
          this.router.navigate([ 'posts' ]);
        }
        else throw new Error('Failed to add post; Something went wrong');
    } catch (error) {
        console.log(error);
        this.addFailed = true;
    }
  }
}

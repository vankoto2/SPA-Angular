import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {

  public postForm: FormGroup;
  public addFailed: boolean;
  public userAuth: Subscription;

  constructor(public fs: FirestoreService,public fb: FormBuilder,public router: Router,public ngZone:NgZone) {
    this.addFailed = false;

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
  }

  async addPost(fg: FormGroup) {
    try {
        if (!fg.valid) throw new Error('Invalid post data');
        this.addFailed = false;
        const result = await this.fs.addPost(fg.value);
        if (result) {
          fg.reset();
          //console.log(result);
          this.fs.addActivePost(true);
          this.fs.addAllPost(true);
          this.router.navigate([ 'posts' ]);
        }
        else throw new Error('Failed to add post; Something went wrong');
    } catch (error) {
        console.log(error);
        this.addFailed = true;
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { UtilsService } from '../services/utils.service';
import { ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() data : any;
  currentUID : any;
  postCreatorInfoSub: Subscription;
  userInformation;
  userEmail;
  showProfile;
  userAuth;
  showContact:boolean;
  constructor(public fs: FirestoreService,public utils:UtilsService,public _ActivatedRoute:ActivatedRoute) { 
    if(utils.getUID()==null){
      utils.setUID(localStorage.getItem('currentUID'));
    }
    this.showProfile = true;
    this.currentUID=utils.getUID();
    this.showContact = false;
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if(user){
        this.userEmail = user.email;
      }
    });
    
    //console.log(this.currentUID);
  }

  async removePost(post: any) {
    try {
        if (!post) throw new Error('Invalid post');
        const result = await this.fs.deletePost(post.id);
        if (!result) throw new Error('Failed to remove post');
    } catch (error) {
        console.log(error);
        alert('Failed to remove post; something went wrong.');
    }
  }

  logData(){
    console.log(this.data);
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

  ngOnInit(): void {
    this.postCreatorInfoSub = this.fs.getUserPersonalData(this.data.uid).valueChanges().subscribe((user:any)=>{
      this.userInformation = user;
    })
    if(this._ActivatedRoute.snapshot.url[0].path == 'profile'){
      this.showProfile = false;
    }
  }

}

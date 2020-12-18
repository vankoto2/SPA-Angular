import { Component, EventEmitter, Input, OnInit,Output ,NgZone} from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.css']
})

export class EditPersonalInfoComponent implements OnInit {

  public updateinfoForm: FormGroup;
  public updateInfoFailed: boolean;
  public succesfullyUpdatedUserInfo: boolean;
  public name:string;
  public city:string;
  public phone:string;
  public imageURL:string;

  @Input('userInformation') userInformation;
  @Input('uid') uid;
  @Input('editPIBool') editPIBool;

  @Output() onDataUpdate: EventEmitter<any> = new EventEmitter<any>();
  
  userAuth: Subscription;

  constructor(public utils: UtilsService,public fb:FormBuilder,public fs:FirestoreService,public ngZone:NgZone,public router:Router) { 
    this.updateinfoForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required])
    });
    this.userAuth = this.fs.signedIn.subscribe((user) => this.ngZone.run(()=>{
        if (user) {
        
        } else {
          this.router.navigate([ 'signin' ]);
        }
      })
    );
  }

  ngOnInit(): void {
    this.name = this.userInformation.name;
    this.city = this.userInformation.city;
    this.phone = this.userInformation.phone;
    this.imageURL = this.userInformation.imageURL;
    this.utils.getUID()
  }

  updateInfo(fg: FormGroup){
    try{
      if (!fg.valid) throw new Error('Invalid post data');
      this.updateInfoFailed = false;
      let {name, city, phone,imageURL} = fg.value;
      let personalData = {
        name:name,
        imageURL:imageURL,
        city:city,
        phone:phone,
        downVotes:0,
        upVotes:0,
        reviews:[]
      };
      this.fs.getPersonalDataRef().doc(this.utils.getUID()).update(personalData)
      .then((result)=>{
        this.succesfullyUpdatedUserInfo = true;
        this.editPIBool=false; 
        this.onDataUpdate.emit(true);
      })
      
    }catch{
      this.updateInfoFailed = true;
    }
  }
  

}

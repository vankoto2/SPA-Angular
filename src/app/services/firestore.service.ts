import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { first } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public signedIn: Observable<any>;

  constructor(
    public utils: UtilsService,
    public fs:AngularFirestore,
    public auth: AngularFireAuth
    ) {
    this.signedIn = new Observable((subscriber)=>{
      this.auth.onAuthStateChanged(subscriber);
      this.auth.currentUser.then(user=>{
        if(user){
          this.utils.setUID(user.uid);
        }
      })
    })
  }

  async addActivePost(setting:boolean){
    let appInfRef = this.fs.collection('app-information');
    let postsInfomation = await this.fs.collection('app-information').valueChanges();
    let postsI:any;
    postsInfomation.pipe(first()).subscribe((users)=>{
      postsI = users[0];
      //console.log(postsI);
      asd();
    })
    function asd(){
      if(setting){
        appInfRef.doc('posts').update({activePosts:postsI.activePosts+1});
      }else if (!setting){
        appInfRef.doc('posts').update({activePosts:postsI.activePosts-1});

      }
    }
  }

  getUserPersonalData(uid){
    let doc = this.fs.collection('user-information').doc(uid);
    return doc;
  }

  async addAllPost(setting:boolean){
    let appInfRef = this.fs.collection('app-information');
    let postsInfomation = await this.fs.collection('app-information').valueChanges();
    let postsI:any;
    postsInfomation.pipe(first()).subscribe((users)=>{
      postsI = users[0];
      //console.log(postsI);
      asd();
    })
    function asd(){
      if(setting){
        appInfRef.doc('posts').update({nOfAllPosts:postsI.nOfAllPosts+1});
      }else{
        appInfRef.doc('posts').update({nOfAllPosts:postsI.nOfAllPosts-1});

      }
    }
  }

  getPostsInfo() {
    return this.fs.collection('app-information').valueChanges();
  }


  async signUp({email,  password}){
    try{
      if(!email || !password) throw new Error('Invalid email anf/or password');
      let result = await this.auth.createUserWithEmailAndPassword(email,password);
      if(result){
        localStorage.setItem('currentUID',result.user.uid);
      }
      return result.user.uid;
    } catch(error) {
      console.log('Sign in failed', error);
      return false;
    }
  }


  async signIn(email: string,password: string){
    try{
      if(!email || !password) throw new Error('Invalid email anf/or password');
      let result = await this.auth.signInWithEmailAndPassword(email,password);
      if(result){
        this.utils.setUID(result.user.uid);
        localStorage.setItem('currentUID',result.user.uid);
      }
      return true;
    } catch(error) {
      console.log('Sign in failed', error);
      return false;
    }
  }

  async signOut(){
    try{
      await this.auth.signOut();
      localStorage.removeItem('currentUID');
      this.utils.setUID(null);
      return true;
    } catch (error){
      console.log('Sign out failed', error);
      return false;
    }
  }

  getPosts() {
    return this.fs.collection('posts').valueChanges({ idField:'id'});
  }
  
  getPostData(postId){
    return this.fs.collection('posts').doc(postId);
  }
  
  async deletePost(id: string){
    try {
      if(!id) throw new Error('Invalid Id or data');
      await this.fs.collection('posts').doc(id).delete();
      this.addActivePost(false);
      this.addAllPost(false);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updatePost(id: string,activeValue:boolean){
    try {
      if(!id) throw new Error('Invalid Id or data');
      await this.fs.collection('posts').doc(id).update({active:activeValue});
      this.addActivePost(activeValue);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addPost(data:any){
    try{
      if(!data) throw new Error('Invalid data');
      data.uid = (await this.auth.currentUser).uid;
      data.active = true;
      let result = await this.fs.collection('posts').add(data);
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  }

  async editPost(data:any,id){
    try{
      if(!data) throw new Error('Invalid data');
      data.uid = (await this.auth.currentUser).uid;
      data.active = true;
      let result = await this.fs.collection('posts').doc(id).set(data);
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  }

  getPersonalDataRef(){
    return this.fs.collection('user-information');
  }
}

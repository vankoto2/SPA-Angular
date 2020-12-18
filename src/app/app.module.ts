import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';

import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PostComponent } from './post/post.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ReviewComponent } from './review/review.component';
import { EditPersonalInfoComponent } from './edit-personal-info/edit-personal-info.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostEditComponent } from './post-edit/post-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PostComponent,
    NavbarComponent,
    ProfileComponent,
    PostsPageComponent,
    CreatePostComponent,
    AboutPageComponent,
    ReviewComponent,
    EditPersonalInfoComponent,
    PostDetailsComponent,
    PostEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }

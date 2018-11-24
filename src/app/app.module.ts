import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {RouterModule,Routes} from '@angular/router';
import { UserModule } from './user/user.module';
//http
import { HttpserviceService } from './httpservice.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
//forms
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';

//file upload module import statement
import {FileUploadModule} from 'ng2-file-upload';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule,ngxLoadingAnimationTypes } from 'ngx-loading';


//social login
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
import { NgxEditorModule } from 'ngx-editor';
import { CreateComponent } from './create/create.component';
import { SearchComponent } from './search/search.component';
import { ViewissueComponent } from './viewissue/viewissue.component';
import { SocketserviceService } from './socketservice.service';

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("905180503008577")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("597246143815-5iu60m3popmj03hr5ib9qkmq2rtdsp22.apps.googleusercontent.com")
        }
         
      ]
  );
  return config;
}





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    CreateComponent,
    SearchComponent,
    ViewissueComponent
  ],
  imports: [
    NgxEditorModule, 
    SocialLoginModule,
    FileUploadModule,
    BrowserModule,
    UserModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() ,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
        backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
        backdropBorderRadius: '4px',
        primaryColour: '#ffffff', 
        secondaryColour: '#ffffff', 
        tertiaryColour: '#ffffff'
    }),
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent},
      {path:'',redirectTo:'login',pathMatch:"full"},
      {path:'signup',component:SignupComponent},
      {path:'profile',component:ProfileComponent},
      {path:'search',component:SearchComponent},
      {path:'create',component:CreateComponent},
      {path:'view/:id',component:ViewissueComponent},
      {path:'*',component:LoginComponent}
    
    ]),
    HttpClientModule
    
  ],
  providers: [
  HttpserviceService,

  {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }
 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

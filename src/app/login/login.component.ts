import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
import{ActivatedRoute,Router} from '@angular/router';
import {Cookie} from "ng2-cookies/ng2-cookies";
import { ToastrService } from 'ngx-toastr';

//social login import statements
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   public email;
   public password;
   public response;
   public object;
   public loading = false;
  constructor(public httpservice:HttpserviceService,
    public toastr:ToastrService,
    public router:Router,private socialAuthService: AuthService) { }

  ngOnInit() {
    
  }
  //social login method
  public socialSignIn(socialPlatform : string) {
    
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } 
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform+" sign in data : " , userData);
        // Now sign-in with userData
        // ...
       this.response = userData;
       this.loading=true;
       Cookie.set('image',this.response.image);
       this.generateToken();
       
       
      }
    );
  }
  // generating Token.
  public generateToken(){
    this.httpservice.SocialSetup(this.response.email,this.response.name,this.response.image).subscribe(
      (data)=>{
        this.object = data;
        console.log(this.object);
        this.httpservice.setLocalstorage(this.object);
        Cookie.set('authToken',this.object.token);
        Cookie.set('userId',this.object.userDetails.userId);
        Cookie.set('listen','not');
        this.loading=false;
        this.toastr.success('logged in successfully!');
        this.router.navigate(['/team']);
      }
    )
  }
  



  public login=()=>{
    
    this.httpservice.httplogin(this.email,this.password).subscribe(  //sending login details to httpservice
      data=>{
      console.log(data);
      this.response=data;
      Cookie.set('authToken',this.response.data.token)
      this.httpservice.setLocalstorage(this.response.data); //storing user information in local storage
      this.object = this.httpservice.getLocalStorage(); // getting info from local storage
      this.toastr.success('logged in successfully!');
      Cookie.set('listen','not');
      console.log(this.object);
      this.router.navigate(['/team']);
      },err=>{
        console.log(err);
        this.toastr.error('Error','please try later');
        this.loading=false;
      }
    )
  }
 
}

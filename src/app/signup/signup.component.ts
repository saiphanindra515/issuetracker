import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
   public email;
   public Name;
   public mobileNumber;
   public password;
   public loading= false;
  constructor(public httpservice:HttpserviceService,
    public toastr:ToastrService,
    public router:Router) { }

  ngOnInit() {
  }
  public signup(){
  this.loading=true;
   this.httpservice.httpsignup(this.Name,this.email,this.password,this.mobileNumber).subscribe(
     data=>{
       this.loading=false;  
        this.toastr.success('successfull','signup successfull');
        this.router.navigate(['/login']);
     },err=>{
         this.toastr.error('Error',"please try later");
         this.loading=false;
     }
   )
  }

}

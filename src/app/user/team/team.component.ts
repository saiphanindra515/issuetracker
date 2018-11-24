import { Component, OnInit } from '@angular/core';
import {Cookie} from "ng2-cookies/ng2-cookies";
import {ActivatedRoute,Router} from '@angular/router';
import { HttpserviceService } from '../../httpservice.service';

import { CreateComponent } from '../../create/create.component';
import {ToastrService} from 'ngx-toastr';
import { instantiateSupportedAnimationDriver } from '../../../../node_modules/@angular/platform-browser/animations/src/providers';


declare var jQuery : any;
declare var $ : any;
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers:[]
})
export class TeamComponent implements OnInit {
  public response;
  public previous = false;
  public next = true;
  public previous2 = false;
  public next2 = true;
  public authToken = Cookie.get('authToken')
  public googleUser = false;
  public userInfo = this.httpserv.getLocalStorage();
   public username=this.userInfo.userDetails.firstName; 
   public userId=this.userInfo.userDetails.userId;
   public email = this.userInfo.userDetails.email;
   public myissues;
  public allIssues;
  public userimage=Cookie.get('image');
  public skip=0;
  public skip2=0;
  public delete(id){
    console.log(id);
    this.httpserv.removeIssues(id).subscribe(
      data=>{
        console.log('deleted');
        location.reload();
      }
    )
  }
 
  constructor(public router:Router,
    public httpserv:HttpserviceService,
    
    public toastr:ToastrService
             
  ) {
    
   }
  
  ngOnInit() {
    //side navbar jquery logic
    $(".wrapper").hide();
    $(".notification").hide();
     //hider is class of fontawesome icon present in sidebar <-
    $(".hider").click((event)=>{
      event.preventDefault();
      $(".wrapper").hide();
      
    });
    //show is class of fontawesome icon present in navbar <->
    $(".show").click((event)=>{
      event.preventDefault();
    
      $(".wrapper").toggle();
      
     
    });
    $(".fa-bell").click((event)=>{
      event.preventDefault();
      $(".notification").toggle();
    })
    this.check();
   
    

    console.log(`userinfo ;${this.userInfo}`);
    console.log( this.userInfo.userDetails.firstName);
    this.CompmyIssues(); //only user issues.
    this.CompAllIssues(); // All issues which are  going on. 
   
  }
  // checking whether authtoken is present or not
  public check(){
   if(this.authToken==null||this.authToken==undefined||this.authToken==""){
     console.log("authtoken is not found");
      this.router.navigate(['/login']);
   }
  }

  //user verification
 
 
// creating a socket listening instance.here user listen to his own issues
public watcher(title,reporteName,description,status,issueId){
    this.httpserv.createAssigners(title,reporteName,description,status,this.userId,this.email,issueId).subscribe(
      data=>{
        this.toastr.success('susbscribed');
        this.router.navigate([`/view/${issueId}`]);
        this.trackwatchers(issueId);
      }
    )
  }
  public trackwatchers=(issueid)=>{
    this.httpserv.trackAssigners(issueid,this.username,this.userId).subscribe(
      data=>{
        console.log("success");
      }
    )
  }
 

  public logout(){
    Cookie.deleteAll();
    
    window.localStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
  public previousFunction(id){
   if(id==1){this.skip=this.skip-1;
   this.CompmyIssues();}
   if(id==2){
     this.skip2=this.skip2-1;
     this.CompAllIssues();
   }
  }
  public nextFunction(id){
    if(id==1){this.skip=this.skip+1;
      this.CompmyIssues();}
      if(id==2){
        this.skip2=this.skip2+1;
        this.CompAllIssues();
      }
    
  }
  //my issues
 public CompmyIssues = ()=>{
  if(this.skip>0){
    this.previous=true;
  }
  if(this.skip==0){
    this.previous=false;
  }
   this.httpserv.myIssues(this.userId,this.skip*10).subscribe(
     data=>{
       console.log(data);
       this.response=data;
       this.myissues=this.response.data;
       if(this.response.status==404){
        this.toastr.info('no issues available');
       }
       
     },err=>{
       console.log(err);
     }
   )
 }
 //all issues 
 public CompAllIssues = ()=>{
  if(this.skip2>0){
    this.previous2=true;
  }
  if(this.skip2==0){
    this.previous2=false;
  }
   this.httpserv.allissues(this.skip2*4).subscribe(
     data=>{
      this.response=data;
       this.allIssues=this.response.data;
       
       if(this.response.status==404){
        this.toastr.info('no issues available');
       }
     },
     err=>{
       
       this.toastr.info('error occured!');
     }
   )
 }

 
}

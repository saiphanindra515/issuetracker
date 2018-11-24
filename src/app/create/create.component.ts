import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
import {Cookie} from "ng2-cookies/ng2-cookies";
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import { SocketserviceService } from '../socketservice.service';
const uri ="http://localhost:3000/file/upload";


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
 //declarations
  public htmlContent;
  public title;
  public reporterName;
  public userInfo=this.httpservice.getLocalStorage();
  public userId=this.userInfo.userDetails.userId;
  public userName = this.userInfo.userDetails.firstName;
  public email = this.userInfo.userDetails.email;
  public status;
  public assigned=[];
  public allDevelopers;
  public response;
  public loading=false;
//file uploading
  public userImage = Cookie.get('image');
  uploader:FileUploader=new FileUploader({url:uri});
  public listoffiles=[];

  constructor(public httpservice:HttpserviceService,
  public toastr:ToastrService,
  public socketService:SocketserviceService) {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false;
    console.log(file);
    };
    this.uploader.onCompleteItem=(item:any,response:any,status:any,headers:any)=>{
      
       this.listoffiles.push(JSON.parse(response));
       console.log(this.listoffiles);
        
    }

   }
  
  ngOnInit() {
    this.Allassigners();
   
    
  }
  //when you select a developer for assigning,he will be pushed to assigned array.
public peopleGotAssigned(name,id){
  let temp = {"IssueName":this.title,"name":name,"id":id,"issueId":this.issueId}; 
  this.assigned.push(temp);
}
// removing assigned person from assigned array
public remove(name){
  let index = this.assigned.map(function(a){return a.name}).indexOf(name);
  this.assigned.splice(index,1);
}
//comment box

//creating issue.
public issueId;
public create=()=>{
  this.loading=true;
  console.log(`${this.htmlContent} ${this.reporterName} ${this.title} ${this.status} ${this.userId}`)
  this.httpservice.createIssue(this.title,this.reporterName,this.htmlContent,this.status,this.userId,this.email).subscribe(
    data=>{
      console.log(data);
      this.response=data;
      this.issueId = this.response.data.issueId;
      console.log("issue id"+this.issueId);
      this.toastr.success('issue created');
      this.assigners();
    },
    err=>{
      console.log(err);
      this.loading=false;
      
      
      
    }
  )
}
public Allassigners = ()=>{
  this.httpservice.allDevelopers().subscribe(
    data=>{
      console.log(data);
    this.allDevelopers=data;
    console.log(this.allDevelopers);
    this.settingup();
  
    },
    err =>{
      console.log(err);
      this.loading=false;
      this.toastr.error('Error', 'Try again later');
    }
  )
}//end
public settingup = ()=>{
  let index2 = this.allDevelopers.map(function(a){
    return a.userId;
  }).indexOf(this.userId);
  this.allDevelopers.splice(index2,1);
  console.log(this.allDevelopers);
}//end
public assigners =()=>{
  for(let i=0;i<this.assigned.length;i++){
    console.log(this.assigned[i].id);
    this.httpservice.createAssigners(this.title,this.reporterName,this.htmlContent,this.status,this.assigned[i].id,this.email,this.issueId
    ).subscribe(
      data=>{
        
        console.log('assigners');
        console.log(data);
        
      },
      err=>{
        console.log(err);
        this.loading=false;
        this.toastr.error('Error', 'Try again later');
      }
    )
  }
  //saving files
  if(this.listoffiles.length>0){
    for(let j of this.listoffiles ){
      console.log(j.originalname);
      console.log(j.uploadname);
      this.httpservice.files(this.issueId,j.originalname,j.uploadname).subscribe(
        data=>{
          console.log(data);
          
        },
        err=>{
          console.log(err);
          this.loading=false;
          this.toastr.error('Error', 'Try again later');
        }
      )
    }
  } 
  this.trackAssigners();
  
}//end of assigners..

public trackAssigners(){
  let temp = {"name":this.userName,"id":this.userId,"issueName":this.title,"issueId":this.issueId}
  this.assigned.push(temp);
  console.log("new assigned");
  console.log(this.assigned);
  for(let i=0;i<this.assigned.length;i++){
    console.log(this.assigned[i].id);
    console.log(this.assigned[i].name);
  this.httpservice.trackAssigners(this.issueId,this.assigned[i].name,this.assigned[i].id).subscribe(
    data=>{
      console.log(data);
    },err=>{
     console.log(err);
     this.loading=false;
     this.toastr.error('Error', 'Try again later');
    }
  )
}
this.storeDetails();
}//trackAssigners
public storeDetails(){
 
  for(let i=0;i<this.assigned.length;i++){
    console.log("data object");
    console.log(this.assigned[i]);
  this.socketService.redisStore(this.assigned[i])
this.loading=false;
}//trackAssigners
this.loading=false;
}

}


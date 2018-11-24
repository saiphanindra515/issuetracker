
import { Component, OnInit,ViewContainerRef,ViewChild ,ElementRef } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Cookie} from "ng2-cookies/ng2-cookies";
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { SocketserviceService } from '../socketservice.service';
import{ToastrService} from 'ngx-toastr';

import {saveAs} from 'file-saver';
const uri ="http://localhost:3000/file/upload";

declare var Jquery:any;
declare var $:any;

@Component({
  selector: 'app-viewissue',
  templateUrl: './viewissue.component.html',
  styleUrls: ['./viewissue.component.css'],
  providers:[SocketserviceService]
})
export class ViewissueComponent implements OnInit {
  @ViewChild('scrollMe',{read:ElementRef})
  public scrollMe : ElementRef;
   public issueId;
   public previousComments = [];
   public response;
   public issue;
   public description;
   public issueDescription;
   public issueName ;
   public skip = 0;
   public issueReporter;
   public userInfo=this.httpservice.getLocalStorage();
   public userId=this.userInfo.userDetails.userId;
   public userName = this.userInfo.userDetails.firstName;
   public email = this.userInfo.userDetails.email;
   public status;
   public assigned=[];
   public scrollToChatTop:boolean=true;
   public noComments:boolean=false;
   public listened = Cookie.get('listen');
   public myissues = this.httpservice.getissues();
   public authToken = Cookie.get('authToken')
 //file uploading
   public userImage = Cookie.get('image');
   uploader:FileUploader=new FileUploader({url:uri});
   public listoffiles:any=[];
  constructor(public httpservice:HttpserviceService,
    public route:ActivatedRoute,
    public socketservice:SocketserviceService,
    public toastr:ToastrService) {

        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        this.uploader.onCompleteItem=(item:any,response:any,status:any,headers:any)=>{
          
           this.listoffiles.push(JSON.parse(response));
           console.log(this.listoffiles);
            
        }
    
       
   }

  ngOnInit() {
  

    this.issueId=this.route.snapshot.paramMap.get('id');
  
    console.log(this.issueId);  
    this.singleIssue();
    
   this.Allassigners();
  
  console.log(this.myissues);
  
  
 this.getFiles();
 this.getWatchers();
 
}






  public listen(){
    for(let issue of this.myissues){
      let temp ={
        "issueId":issue.issueId,
        "listening":false
      }
    } 
  } 
  
  public singleIssue=()=>{
    this.httpservice.issue(this.issueId).subscribe(
      data=>{
         this.response=data;
         this.issue=this.response.data;
         this.issueDescription=this.issue[0].issueDescription;
         this.issueReporter=this.issue[0].issueReporter;
         this.issueName=this.issue[0].issueName;
         this.status=this.issue[0].status;
        console.log(this.description);
        $('#des').append(this.description);
         console.log(this.response); 
      },err=>{
        console.log(err);
      }
    )
  }
  public peopleGotAssigned(name,id){
    let temp = {"name":name,"id":name}; 
    this.assigned.push(temp);
  }
  // removing assigned person from assigned array
  public remove(name){
    let index = this.assigned.map(function(a){return a.name}).indexOf(name);
    this.assigned.splice(index,1);
  }

  //comment box
  public messageList = [];
  public comment;
  public message; 
  //send message
  public sendmessage=(event:any)=>{
   if(event.keyCode==13){
     this.scrollToChatTop=false;
      this.createMessageObject();    
   }
  }//end
  //get comments
 
    public createMessageObject=()=>{
     
      let newobj ={
        "comment":true,
        "senderName":this.userName,
        "message":this.message,
        "issueName":this.issue[0].issueName,
        "issueId":this.issueId,
        "time" : new Date()
      } 
      this.message="";
      this.messageList.push(newobj);
      this.sendtoserver(newobj);
    }
  


 public sendtoserver = (newobj)=>{
   console.log("send  server");
   this.socketservice.sendMessage(newobj);
 }

  public Allassigners = ()=>{
    this.httpservice.allDevelopers().subscribe(
      data=>{
        console.log(data);
      },
      err =>{
        console.log(err);
      }
    )
  }
  // editing the issue.
  public edit(){
    this.httpservice.EditIssue(this.issueName,this.issueReporter,this.issueDescription,this.status,this.issueId).subscribe(
      data=>{
        alert("issue updated");
        location.reload();
      },err=>{
          alert("some error occured");
      }
    )
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
          }
        )
      }
    }
  }


  
  public allfiles;
  public getFiles(){
    this.httpservice.getfiles(this.issueId).subscribe(
      data=>{
        console.log(data);
        this.allfiles=data;
      }
      ,err=>{
        console.log(err);
      }
    )
  }

public download(name){
  this.httpservice.downloadFile(name).subscribe(
    data=>{
       saveAs(data,name)
    },
    err=>{
      console.log(err);
    }
  )
}
public watchers;
public getWatchers = ()=>{
  this.httpservice.getAssigners(this.issueId).subscribe(
    data=>{
      this.response=data;
      this.watchers=this.response.data;
      console.log(this.watchers);
    }
  )
}

}//end of component class.

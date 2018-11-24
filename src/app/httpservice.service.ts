import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import{HttpParams,HttpHeaders} from '@angular/common/http';
import{ Observable } from 'rxjs';
import { EmailValidator } from '../../node_modules/@angular/forms';
import { Title } from '../../node_modules/@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {
   public response;
   public BaseUrl="http://localhost:3000/api/v1";
  constructor(public _http:HttpClient) { }
  // setting user details into local storage
  public setLocalstorage(data){
    localStorage.setItem('userInfo',JSON.stringify(data));
  }
  public setissues(issues){
    localStorage.setItem('issues',JSON.stringify(issues));
  }
  public getissues=():any=>{
    return JSON.parse(localStorage.getItem('issues'));
  }
  // getting user details form local storage
  public getLocalStorage=():any=>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  // signup Http post request
  public httpsignup=(Name,email,password,mobileNumber)=>{
    const params = new HttpParams()
    .set('name',Name)
    .set('mobileNumber',mobileNumber)
    .set('email',email)
    .set('password',password)
    this.response=this._http.post(`${this.BaseUrl}/users/signup`,params);
    return this.response;
  }//end of signup

  // login Http post request
  public httplogin = (email,password)=>{
    const params = new HttpParams()
    .set('email',email)
    .set('password',password)
    this.response=this._http.post(`${this.BaseUrl}/users/login`,params);
    return this.response;
  }
  //social login background setup(i dont want to use facebook or google token,i am creating new token).
  public SocialSetup = (email,name,image)=>{
    const params = new HttpParams()
    .set('email',email)
    .set('name',name)
    .set('image',image)
    this.response=this._http.post(`${this.BaseUrl}/users/socialSignup`,params);
    return this.response;
  }
  //save created issue
  public createIssue = (title,reporterName,Description,status,userId,email)=>{
     const params = new HttpParams()
     .set('issueName',title)
     .set('issueDescription',Description)
     .set('issueReporter',reporterName)
     .set('reporterId',userId)
     .set('email',email)
     .set("status",status)
     return this._http.post(`${this.BaseUrl}/users/createIssue`,params);
  }
  //create assigners
  public createAssigners = (title,reporterName,Description,status,userId,email,issueId)=>{
    const params = new HttpParams()
    .set('issueName',title)
    .set('issueId',issueId)
    .set('issueDescription',Description)
    .set('issueReporter',reporterName)
    .set("assignedId",userId)
    .set('email',email)
    .set("status",status)
    return this._http.post(`${this.BaseUrl}/users/createAssigners`,params);
 }
  //user issues
  public myIssues =(userId,skip)=>{
   const params = new HttpParams()
   
   return this._http.get(`${this.BaseUrl}/users/myissues?reporterId=${userId}&skip=${skip}`);
  }
  public mysearchIssues =(userId,skip)=>{
    const params = new HttpParams()
    
    return this._http.get(`${this.BaseUrl}/users/searchIssues?reporterId=${userId}&skip=${skip}`);
   }
  public removeIssues =(issueId)=>{
    const params = new HttpParams()
    .set('issueId',issueId)
    return this._http.post(`${this.BaseUrl}/users/removeIssue`,params)
   }
public allissues = (skip)=>{
  return this._http.get(`${this.BaseUrl}/users/allIssues?skip=${skip}`);
}
public issue = (issueId)=>{
  const params = new HttpParams()
  .set('IssueId',issueId)
  return this._http.post(`${this.BaseUrl}/users/findIssue`,params);
}
//all developers
public allDevelopers = ()=>{
  return this._http.get(`${this.BaseUrl}/users/allDevelopers`);
}
//save file
public files = (issueId,orgfilename,filename)=>{
const params = new HttpParams()
.set('issueId',issueId)
.set('originalName',orgfilename)
.set('fileName',filename)
return this._http.post(`${this.BaseUrl}/users/createFiles`,params);
}
//get comments
public getComments=(issueId,skip)=>{
  const params = new HttpParams()
  .set('issueId',issueId)
  .set('skip',skip)
  return this._http.post(`${this.BaseUrl}/users/getComments`,params);
}
//create assigners 
public createsocAssigner =(issueId,userId,userName)=>{
  const params = new HttpParams()
  .set('IssueId',issueId)
  .set('userId',userId)
  .set('userName',userName)

return this._http.post(`${this.BaseUrl}/users/createAssigner`,params);
}
//get assigners
public getAssigners =(issueId)=>{
return this._http.get(`${this.BaseUrl}/users/getAssigners?issueId=${issueId}`);
}
//tracking people who are assigned to the project.
public trackAssigners = (issueId,firstName,userId)=>{
  const params = new HttpParams()
  .set('issueId',issueId)
  .set('firstName',firstName)
  .set('userId',userId)
  return this._http.post(`${this.BaseUrl}/users/trackAssigner`,params);
}
//getting assigned people..
public getAssigned = (issueId)=>{
  return this._http.get(`${this.BaseUrl}/users/getAssigners?issueId=${issueId}`);
}
//editIssue
public EditIssue = (title,reporterName,Description,status,issueId)=>{
  const params = new HttpParams()
  .set('issueId',issueId)
  .set('issueName',title)
  .set('issueDescription',Description)
  .set('issueReporter',reporterName)
  .set("status",status)
  return this._http.put(`${this.BaseUrl}/users/editIssue`,params);
}
public getfiles =(issueid)=>{
  const params = new HttpParams()
  .set('issueId',issueid)
  return this._http.post(`${this.BaseUrl}/users/getFiles`,params);
}
public downloadFile =(name)=>{
var body = {filename:name}
return this._http.post(`http://localhost:3000/file/download`,body,{
  responseType:'blob',
  headers:new HttpHeaders().append('content-Type','application/json')
})
}

}

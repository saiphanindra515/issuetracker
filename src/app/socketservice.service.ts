import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
 import {HttpClient,HttpParams,HttpErrorResponse} from '@angular/common/http';
import { Observable } from '../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketserviceService {
  private url="http://localhost:3000";

  private socket=io(this.url);
  constructor() {
    
   }
  
   public verify = ()=>{
     console.log('verify user observable called');
     return Observable.create((observer)=>{
       this.socket.on('verifyUser',(data)=>{
          console.log('user at verifyUser');
          observer.next(data);
       })
     })
   }

   public setuser:any=(authToken)=>{
    console.log('set user observable called');
         this.socket.emit('setUser',(authToken));
      
     
   }
   // creating room
   public redisStore =(data)=>{
     this.socket.emit('create-room',data);
   }
   //getting notification
   public comments = ()=>{
     return Observable.create((observer)=>{
       this.socket.on('comments',(data)=>{
         console.log('comments called 1');
         observer.next(data);
       })
     })
   }
   //notification
   public notification = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('notification',(data)=>{
        observer.next(data);
      })
    })
  }
   //user is verified.
   public userverified=()=>{
     return Observable.create((observer)=>{
       this.socket.on('user-verified',(data)=>{
          observer.next(data);
       })
     })
   }
    //authentication error
   public autherror=()=>{
     return Observable.create((observer)=>{
       this.socket.on("auth-error",(data)=>{
         observer.next(data);
       })
     }

     )
   }
   // authentication error
 

  public sendMessage = (obj)=>{
    this.socket.emit('message',obj);
  }
  public disconnect(){
    this.socket.emit('disconnect','disconnected');
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
declare var jQuery : any;
declare var $ : any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public userInfo = this.httpserv.getLocalStorage();
  public myissues;
  public response;
  public userId=this.userInfo.userDetails.userId;
  constructor(public httpserv:HttpserviceService) { }

  public obj = [
    {
      title:"chat application",
      Description:"how to create group chat",
      createdOn:"jan 1st",
      reporter:"samantha"
    },
    {
      title:"Blog application",
      Description:"how to edit blog",
      createdOn:"march 22nd",
      reporter:"nagachaitanya"
    },
    {
      title:"countries",
      Description:"some countries are unavailable",
      createdOn:"April 25th",
      reporter:"Anushka"
    },
  ]

  ngOnInit() {
    $("#inputWord").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#issueTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
    this.CompmyIssues();
  }
  public CompmyIssues = ()=>{
    this.httpserv.myIssues(this.userId,0).subscribe(
      data=>{
        console.log(data);
        this.response=data;
        this.myissues=this.response.data;
        console.log(this.myissues);
      },err=>{
        console.log(err);
      }
    )
  }
}

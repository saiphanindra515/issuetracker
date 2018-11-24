import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team/team.component';
import {RouterModule,Router} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'team',component:TeamComponent}
    ])
  ],
  declarations: [TeamComponent]
})
export class UserModule { }

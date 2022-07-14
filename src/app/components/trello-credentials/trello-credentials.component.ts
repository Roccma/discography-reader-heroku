import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrelloCredentials } from 'src/app/interfaces/trello-credentials';
import { NotiflixService } from 'src/app/services/notiflix.service';
import { TrelloService } from 'src/app/services/trello.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trello-credentials',
  templateUrl: './trello-credentials.component.html',
  styleUrls: ['./trello-credentials.component.css']
})
export class TrelloCredentialsComponent implements OnInit {

  credentials: TrelloCredentials;

  constructor( private trelloService: TrelloService,
              private notiflixService: NotiflixService ) { 
    this.credentials = this.trelloService.getTrelloCredentials();
  }

  ngOnInit(): void {
  }

  onSaveChanges( credentialsForm:NgForm ){
    
    if( credentialsForm.form.controls['key'].errors ){
      this.notiflixService.showAlert('You must complete the App Key to continue', 'failure');
      return;
    }

    if( credentialsForm.form.controls['token'].errors ){
      this.notiflixService.showAlert('You must complete the Token to continue', 'failure');
      return;
    }

    this.trelloService.setTrelloCredentials({
      key: credentialsForm.form.controls['key'].value,
      token: credentialsForm.form.controls['token'].value
    });

    this.updateCredentials();

    this.notiflixService.showAlert('The credentials have been changed successfully');
    
  }

  updateCredentials(): void{
    this.credentials = this.trelloService.getTrelloCredentials();
  }

}

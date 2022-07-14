import { Component, OnInit } from '@angular/core';
import { Disk } from 'src/app/interfaces/disk';
import { NotiflixService } from 'src/app/services/notiflix.service';
import { TrelloService } from 'src/app/services/trello.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Variable to pass by input all the readed disks to data-reader component
  disks: Disk[];

  constructor( private trelloService: TrelloService,
                private notiflixService: NotiflixService ) { 
    this.disks = [];
  }

  ngOnInit(): void {
    //Loading feedback
    this.notiflixService.showLoading('Reading data');
    
    //Subscribe to the read .txt function
    this.trelloService.getDiscographyData().
      subscribe( 
        ( data ) => {
            // If it's ok, set the disks value and hide the loading feedback
            this.disks = data;
            this.notiflixService.hideLoading()
        },
        ( error ) => { 
          // If anything was wrong, then show the message          
            this.notiflixService.showAlert(error.message, 'failure');
            this.notiflixService.hideLoading();
        });     
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardSettings } from 'src/app/interfaces/board-settings';
import { NotiflixService } from 'src/app/services/notiflix.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { TrelloService } from 'src/app/services/trello.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.css']
})
export class BoardSettingsComponent implements OnInit {

  boardSettings: BoardSettings;
  

  constructor( private trelloService: TrelloService,
              private spotifyService: SpotifyService,
              private notiflixService: NotiflixService) { 
    this.boardSettings = trelloService.getBoardSettings();
  }

  ngOnInit(): void {
  }

  async onCreateBoard( boardForm: NgForm ){

    // Controls the field name is setted
    if( boardForm.form.controls['name'].errors ){
      this.notiflixService.showAlert('You must complete the board\'s name to continue', 'failure');
      return;
    }

    // Controls the field artist is setted
    if( boardForm.form.controls['artist'].errors ){
      this.notiflixService.showAlert('You must complete the artist\'s name to continue', 'failure');
      return;
    }

    await this.trelloService.setBoardSetting( {
      name: boardForm.form.controls['name'].value,
      artist: boardForm.form.controls['artist'].value,
      publicBoard: boardForm.form.controls['publicBoard'].value
    } );

    this.notiflixService.showLoading('Creating Board. Plase wait...');

    //Creates spotify API token

    await this.spotifyService.generateToken()
      .then(
        (token: any) => {
          this.spotifyService.setAccessToken( token.data.access_token );
        }
      )
      .catch( 
        ( error: any ) => {
          this.notiflixService.showAlert( error.message, 'failure' );
          this.notiflixService.hideLoading();
        }
        
       );

       // Creates the Trello's Board
      await this.trelloService.createBoard().
        then( 
          ( board: any ) => {            
            // If ok, save the board's id            
            this.trelloService.setBoardId( board.data.id ); 
            this.trelloService.setBoardUrl ( board.data.url );
          },
          ( error: any ) => {
            // If not ok, show the alert
            this.notiflixService.showAlert(error.message, 'failure');
            this.notiflixService.hideLoading();
          }
      );

      // Creates the Lists and Cards
      await this.trelloService.createBoardContent();    


  }

}

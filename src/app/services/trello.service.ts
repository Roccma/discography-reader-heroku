
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Decade } from '../interfaces/decade';
import { Disk } from '../interfaces/disk';
import axios from 'axios';
import { SpotifyService } from './spotify.service';
import { TrelloCredentials } from '../interfaces/trello-credentials';
import { BoardSettings } from '../interfaces/board-settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotiflixService } from './notiflix.service';
import { Router } from '@angular/router';

const httpHeaders = {
  headers: { 'Content-Type': 'application/json' }
};

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

  // Provides the credentials data
  private trelloCredentials: TrelloCredentials;
  
  // Provides the board preferences
  private boardSettings: BoardSettings;
  
  // Collection of readed disks
  private disks: Disk[];
  
  // Lists in Trello
  private decades: Decade[];

  // Board Id generated
  private boardId: string;

  // Board Url generated
  private boardUrl: string;

  constructor( private httpClient: HttpClient, 
              private spotifyService: SpotifyService,
              private notiflixService: NotiflixService,
              private router: Router ) { 
    
    //Basic initialize of all variables 

    this.boardId = '';
    this.boardUrl = '';
    
    this.trelloCredentials = {
      key: environment.trello_key,
      token: environment.trello_token
    } 

    this.boardSettings = {
      name: '',
      publicBoard: true,
      artist: environment.default_artist
    }

    this.disks = [];

    this.decades = [];

  }

  public setTrelloCredentials( newCredentials: TrelloCredentials ){
    this.trelloCredentials = newCredentials;
  }

  public getTrelloCredentials(): TrelloCredentials{
    return this.trelloCredentials;
  }

  public setBoardSetting( newBoardSettings: BoardSettings ){
    this.boardSettings = newBoardSettings;
  }

  public getBoardSettings(): BoardSettings{
    return this.boardSettings;
  }

  public getDisks(): Disk[]{
    return this.disks;
  }

  public setBoardId( boardId: string ){
    this.boardId = boardId;
  }

  public getBoardId(): string{
    return this.boardId;
  }

  public setBoardUrl( boardUrl: string ){
    this.boardUrl = boardUrl;
  }

  public getBoardUrl(): string{
    return this.boardUrl;
  }

  public getDecades(): Decade[]{
    return this.decades;
  }

  getDiscographyData(): Observable<Disk[]>{
    
    return this.httpClient.get( environment.discography_directory , {responseType: 'text'})
      .pipe( map(
        ( data:any )  => {
          // Parse data to string
          data = data.toString();

          // For each end line, I add a new disk
          let disksData = data.split('\n');

          // If the last disk is empty, then I delete the element
          if( disksData[ disksData.length - 1 ].length === 0 ){
            disksData.pop();
          }

          for( let disk of disksData ){
            // Split only the first appearence of the space
            let splitted = disk.split(/ (.*)/s);
            let year = parseInt( splitted[0] );
            let name = splitted[1];
            
            //If the year exists, then add the item to the disks array
            if( year && !this.diskExists( year, name ) ){
              this.disks.push({
                year, name
              });
            }
          }

          // Order disks
          this.orderDisks();

          // Set the pos attribute. This attribute will be passed in the trello API call
          this.setPositions();
          
          // Generate the decades values. This will be the board's lists
          this.generateDecades();
          
          return this.disks;
        }
      ) );
  }

  diskExists( year: number, name: string ): boolean{
    const filteredDisks = this.disks.filter(
      (disk: Disk) => ( disk.year === year && disk.name === name )
    );
    return filteredDisks.length > 0;
  }

  orderDisks(): void{
    this.disks.sort( (first, second) => {

      // If years are diferentes between the two disks
      if (first.year !== second.year)
       return first.year - second.year;
      
      // If the years are the same, then order by alphabetic order
      return first.name.toLowerCase() < second.name.toLowerCase() ? -1 : 1;
    })
  }

  generateDecades(): void{
    let pos: number = 1;

    this.disks.forEach( disk => {
      
      const prefix: string = disk.year.toString().substring(0, 3); // Get the first 3 number of the year
      const name: string = `${ prefix }0's`; // Complete the decade's name
      
      const decade: Decade = {
        name,
        prefix
      };

      // If the decade isn't in the array, then add it.
      if( !this.decadeExists( decade.name ) ){
        // Set the pos attribute
        decade.pos = pos;
        this.decades.push( decade );
        pos++;
      }
    } );
  }
  
  setPositions(): void{
    for( const [ index, disk ] of this.disks.entries() ){
        disk.pos = index + 1;
    }
  }

  decadeExists( name: string ){
   const find = this.decades.filter( decade => decade.name === name );
   return find && find.length > 0;
  }

  createBoard(): any {
    const { name, publicBoard } = this.boardSettings;
    return axios.post( `${ environment.trello_api_base }boards/`, {
      name,
      defaultLists: false,
      prefs_permissionLevel : publicBoard ? 'public' : 'private',
      ...this.trelloCredentials
    }, httpHeaders );
  }

  async createBoardContent(){

    // Create a copy of the disks list.
    // I will use that to control what cards are added in the trello's board with success
    // and what others no.
    // These others, I will retry to insert them again

    let disksCopy: Disk[] = [];
    this.disks.forEach(
      disk => disksCopy.push( disk )
    )

    for( const decade of this.decades ){
      // For each decade, I create a List on the board
      await this.createList( decade );
    }

    
    while( disksCopy.length > 0 ) {
      for( let [index, disk] of disksCopy.entries() ){
        await this.createCard( disk )
          .then( card => {
            // If the card was created succesfully, I quit the disks of the array
            disksCopy.splice( index, 1 );
          } );
      }
    }
    this.notiflixService.hideLoading();
    this.notiflixService.showSuccess('Success!', 'The board has been created successfully', 'Continue');
    this.router.navigate(['/board']);

  }

  createList( decade: Decade ){
    const { name, prefix, pos } = decade;
    return axios.post( `${ environment.trello_api_base }boards/${ this.boardId }/lists`, {
          name,
          pos,
          ...this.trelloCredentials
        }, httpHeaders )
        .then( ( response: any )  => {
          // Set idList attribute in each disk
          this.setIdList( prefix, response.data.id );
          // Set idList attribute in each list too
          decade.idList = response.data.id;

        },
        ( error: any ) => {
          this.notiflixService.showAlert( error.message, 'failure' );
          this.notiflixService.hideLoading();
        } );
  }

  async createCard( disk: Disk ){
    const { name, year, pos, idList } = disk;
    const urlSource = await this.spotifyService.searchAlbum( name, this.boardSettings.artist );
    disk.picture = urlSource;
    return axios.post( `${ environment.trello_api_base }cards/`,
        {
          name: `${ year } - ${ name }`,
          idList,
          pos,
          urlSource,
          ...this.trelloCredentials
        }, httpHeaders );
  }

  setIdList( prefix: string, idList: string ): void{  
    this.disks.filter(
      ( disk: Disk ) => {
        if( disk.year.toString().substring(0, 3) === prefix ){
          // If frist 3 numbers of the release year is equal to prefix
          // set the idList of the disk
          disk.idList = idList;
        }
      }
    )
  }

  getCardsByIdList( idList: string | undefined ): Disk[]{
    return idList ? this.disks.filter(
                        disk => disk.idList === idList
                      ) : [];
  }  
}

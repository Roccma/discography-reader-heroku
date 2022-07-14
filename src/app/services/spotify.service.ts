import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { NotiflixService } from './notiflix.service';
import { SpotifyData } from '../interfaces/spotify-data';

const httpHeadersToken = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
};


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private accessToken: string;

  constructor( private notiflixService: NotiflixService ) { 
    this.accessToken = "";
  }

  getAccessToken(): string{
    return this.accessToken;
  }

  setAccessToken( accessToken: string ): void{
    this.accessToken = accessToken;
  }

  generateToken(){
    
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', environment.spotify_client_id);
    body.set('client_secret', environment.spotify_client_secret);
    return axios.post( 'https://accounts.spotify.com/api/token',
        body.toString(),
        httpHeadersToken);
  }

  searchAlbum( album: string, artist: string ){

    const httpHeadersGeneral = {
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.accessToken }`}
    };

    // I replace & for %26, for example Bob Dylan & The Dead
    return axios.get(`${ environment.spotify_api_base }search?type=album&q=album:${ album.replace('&', '%26') }+artist:${ artist.replace('&', '%26') }`, 
      httpHeadersGeneral)
        .then((response: any) => {
          if( response.data.albums.items.length > 0 ){     
            // Get the album       
            return this.getArtClipUrl( response.data.albums.items, album );
          }
          return null;
        },
        (error: any) => {
          this.notiflixService.showAlert( error.message, 'alert' );
          this.notiflixService.hideLoading();
        }
       )
  }

  getArtClipUrl( items: any, album: string ){

    // If it's only one element, return its url
    if( items.length === 1 )
      return items[0].images[0].url;
    
    // If it's more than one result, I will find the one which has the same name.
    // Some cases like Dylan disk, in Spotify add something like Dylan (1987). 
    // I contemplate that and I take the part before de first parenthesis

    const selectedAlbum = items.filter(
      (item:any) => {                  
            return (item.name.toLowerCase() === album.toLowerCase() ||
                    item.name.split('(')[0].trim().toLowerCase() === album.toLowerCase())
      }
    )

    // If it found at the least one element, returns the first. Otherwise, returns null.

    return selectedAlbum.length > 0 ? selectedAlbum[0].images[0].url : null;
  }
}

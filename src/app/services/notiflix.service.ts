import { Injectable } from '@angular/core';
import * as Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class NotiflixService {

  constructor() {
    Notiflix.Notify.init({
      width: '400px',
      timeout: 5000,
      position: 'right-top',
      cssAnimationStyle: 'from-top',
      distance: '15px',
      fontSize: '18px'
    });

    Notiflix.Loading.init({
      svgColor: '#28a745',
      messageFontSize: '14px'
    });

    Notiflix.Report.init({
      titleFontSize: '22px',
      messageFontSize: '18px',
      buttonFontSize: '18px'
    });
  }

  showAlert( message: string, type = 'success' ): void{
    switch( type ){
      case 'success':
        Notiflix.Notify.success( message );
        break;
      case 'warning':
        Notiflix.Notify.warning( message );
        break;
      case 'failure':
        Notiflix.Notify.failure( message );
        break;
      default:
        Notiflix.Notify.success( message );
        break;
    }
  }

  showLoading( message: string ): void{
    Notiflix.Loading.pulse( message );
  }

  hideLoading(){
    Notiflix.Loading.remove();
  }

  showSuccess( title: string, message: string, button: string ){
    Notiflix.Report.success(
      title,
      message,
      button);
  }
}
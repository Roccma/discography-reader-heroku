import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardComponent } from './pages/board/board.component';

import { TrelloCredentialsComponent } from './components/trello-credentials/trello-credentials.component';
import { BoardSettingsComponent } from './components/board-settings/board-settings.component';
import { DataReaderComponent } from './components/data-reader/data-reader.component';
import { FormsModule } from '@angular/forms';
import { ResultComponent } from './components/result/result.component';
import { RouterModule } from '@angular/router';
import { DiskCardComponent } from './components/disk-card/disk-card.component';
import { DecadeListComponent } from './components/decade-list/decade-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    BoardComponent,
    TrelloCredentialsComponent,
    BoardSettingsComponent,
    DataReaderComponent,
    ResultComponent,
    DiskCardComponent,
    DecadeListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

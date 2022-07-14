import { Component, OnInit } from '@angular/core';
import { Decade } from 'src/app/interfaces/decade';
import { TrelloService } from 'src/app/services/trello.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  decades: Decade[];

  constructor( private trelloService: TrelloService ) { 
    this.decades = trelloService.getDecades();
  }

  ngOnInit(): void {}

  onOpenInTrello(): void{
    window.open(this.trelloService.getBoardUrl(), '_blank')
  }

}

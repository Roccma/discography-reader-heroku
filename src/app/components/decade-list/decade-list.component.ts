import { Component, Input, OnInit } from '@angular/core';
import { Decade } from 'src/app/interfaces/decade';
import { Disk } from 'src/app/interfaces/disk';
import { TrelloService } from 'src/app/services/trello.service';

@Component({
  selector: 'app-decade-list',
  templateUrl: './decade-list.component.html',
  styleUrls: ['./decade-list.component.css']
})
export class DecadeListComponent implements OnInit {

  disks: Disk[];

  @Input() decade: Decade = {
    name: '',
    prefix: ''
  };

  constructor( private trelloService: TrelloService ) { 
    this.disks = [];
  }

  ngOnInit(): void {
    this.disks = this.trelloService.getCardsByIdList( this.decade.idList );
  }



}

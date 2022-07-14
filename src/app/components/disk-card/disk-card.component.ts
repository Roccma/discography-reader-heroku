import { Component, Input, OnInit } from '@angular/core';
import { Disk } from 'src/app/interfaces/disk';

@Component({
  selector: 'app-disk-card',
  templateUrl: './disk-card.component.html',
  styleUrls: ['./disk-card.component.css']
})
export class DiskCardComponent implements OnInit {

  @Input() disk: Disk = {
    name: '',
    year: 0
  };

  constructor() { }

  ngOnInit(): void {
  }

}

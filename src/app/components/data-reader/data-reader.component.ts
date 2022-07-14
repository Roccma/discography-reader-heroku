import { Component, Input, OnInit } from '@angular/core';
import { Disk } from 'src/app/interfaces/disk';

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrls: ['./data-reader.component.css']
})
export class DataReaderComponent implements OnInit {

  @Input() disks: Disk[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}

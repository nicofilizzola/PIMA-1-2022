import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrls: ['./add-event-list.component.scss']
})
export class AddEventListComponent implements OnInit {
  items = [1, 2, 3];

  constructor() { }

  ngOnInit(): void {
  }

  onAdd(){
    this.items[this.items.length] = this.items.length
  }

}

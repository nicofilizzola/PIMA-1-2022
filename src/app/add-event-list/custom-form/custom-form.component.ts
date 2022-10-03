import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss']
})
export class CustomFormComponent implements OnInit {
  isVisible = true;
  @Input() itemId;
  @Output() deleteItem = new EventEmitter<number>();


  constructor() { }

  ngOnInit(): void {
  }

  onDeleteItem() {
    this.deleteItem.emit(this.itemId);
  }
}

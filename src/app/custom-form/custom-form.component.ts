import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss']
})
export class CustomFormComponent implements OnInit {
  isVisible = true;
  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.isVisible=false;
  }

  onAdd(){
    
  }
}

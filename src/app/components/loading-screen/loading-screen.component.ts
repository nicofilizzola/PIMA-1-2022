import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  animations: [
    trigger('loading', [
      state(
        '*',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'void',
        style({
          transform: 'translateY(-100%)',
        })
      ),
      transition('* => void', animate('0.3s ease-out')),
    ]),
  ],
})
export class LoadingScreenComponent implements OnInit {
  @Input() on: boolean;

  constructor() {}

  ngOnInit(): void {}
}

/**
 * Animation provided by loading.io
 */

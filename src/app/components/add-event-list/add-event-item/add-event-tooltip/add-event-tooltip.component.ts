import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-event-tooltip',
  templateUrl: './add-event-tooltip.component.html',
  styleUrls: ['./add-event-tooltip.component.scss'],
})
export class AddGcalEventTooltipComponent implements OnInit {
  @Input() content;
  tooltip;

  ngOnInit(): void {}
}

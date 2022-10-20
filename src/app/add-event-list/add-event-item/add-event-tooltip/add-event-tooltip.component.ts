import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-event-tooltip',
  templateUrl: './add-event-tooltip.component.html',
  styleUrls: ['./add-event-tooltip.component.scss'],
})
export class AddEventTooltipComponent implements OnInit {
  @Input() content;
  tooltip;

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.tooltip = document.getElementById('tooltip');
    this.tooltip.setAttribute('ngbTooltip', this.content);
  }
}

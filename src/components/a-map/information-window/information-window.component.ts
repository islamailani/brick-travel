import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { IViewPointBiz } from '../../../bizModel/model/viewPoint.biz.model';
import { ActionAllowed } from '../a-map.component';

@Component({
  selector: 'information-window-a',
  templateUrl: 'information-window.component.html'
})
export class InformationWindowComponent {
  //Private member

  //Private member

  //Event
  @Output() public viewPointClickedEvent : EventEmitter<IViewPointBiz>;
  //Event

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
    this.viewPointClickedEvent = new EventEmitter<IViewPointBiz>();
  }
  //Constructor

  //Public property

  @Input() public actionAllowed: ActionAllowed;
  @Input() public viewPoint: IViewPointBiz;

  //Public property

  //Implemented interface

  //Implemented interface

  //Public method
  public detectChanges(): void {
    this._cdRef.detectChanges();
  }
  //Public method

  //Protected method
  protected getIconName() {
    return this.actionAllowed === ActionAllowed.REMOVE ? 'remove' : 'add';
  }

  protected getStyle() {
    return {
      'background-color': this.actionAllowed === ActionAllowed.NONE ? '#ffffff;' : '#e6e0e0;'
    }
  }

  protected displayButton() : boolean {
    return this.actionAllowed !== ActionAllowed.NONE;
  }

  protected viewPointClicked(viewPoint : IViewPointBiz) {
    this.viewPointClickedEvent.emit(viewPoint);
  }

  //Protected method
}

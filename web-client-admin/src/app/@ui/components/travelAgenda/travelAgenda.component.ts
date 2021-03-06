import { Component, Input, Output, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { ITravelAgendaBiz, ITravelViewPointBiz, IDailyTripBiz } from '../../../@core/store/bizModel/model/travelAgenda.biz.model';
import { DragulaService } from '../../providers/dragula.service';

@Component({
    selector: 'bt-ta',
    templateUrl: 'travelAgenda.component.html',
    styleUrls: ['travelAgenda.component.scss']
  })
  export class TravelAgendaComponent implements AfterViewInit, OnDestroy {
    //#region Private member

    //#endregion

    //#region Protected property

    @Input() protected travelAgenda: ITravelAgendaBiz;

  //#endregion

  //#region Constructor

  constructor(private _dragulaService: DragulaService, private _renderer: Renderer2) {
  }

  //#endregion

    //#region Interface implementation

  ngAfterViewInit(): void {
    // this._dropModelSub = this._dragulaService.dropModel.subscribe((value: any) => {
    //   if (value[0] == 'vp-bag') {
    //     this.switchTravelViewPointEvent.emit(this.selectedDailyTrip);
    //   }
    //   else {
    //     this.switchDailyTripEvent.emit(this.travelAgenda);
    //   }
    // });

    // this._dragSub = this._dragulaService.drag.subscribe((value: any) => {
    //   let bagName = value[0];
    //   let el = value[1];
    //   let source = value[2];

    //   if (bagName === 'vp-bag') {
    //     this.onViewPointDrag(el, source);
    //   }
    //   else {
    //     this.onDayDrag(el, source);
    //   }
    // });

    // this._dragEndSub = this._dragulaService.dragend.subscribe((value: any) => {
    //   let bagName = value[0];
    //   let el = value[1];

    //   if (bagName === 'vp-bag') {
    //     this.onViewPointDragEnd(el);
    //   }
    //   else {
    //     this.onDayDragEnd(el);
    //   }
    // });

    // this._vpScrollContent = this._vpScroll.nativeElement.querySelector('.scroll-content');
    // this._dayScrollContent = this._dayScroll.nativeElement.querySelector('.scroll-content');
  }

  ngOnDestroy(): void {
    // this._dragSub.unsubscribe();
    // this._dragEndSub.unsubscribe();
    // this._dropModelSub.unsubscribe();
  }

    //#endregion

    //#region Protected method
  protected get dragulaOptions(): any {
    const that = this;
    const that_moves = (el: any, source: any, handle: any, sibling: any): boolean => {
      return that.moves(el, source, handle, sibling);
    };
    return { moves: that_moves };
  }

  protected onTransportChange(travelViewPoint: any) {
    // this.tranportationChangedEvent.emit(travelViewPoint);
  }

  protected dayClicked(dailyTrip: IDailyTripBiz): void {
    // if (!this.selectedDailyTrip || dailyTrip.id != this.selectedDailyTrip.id) {
    //   this.dailyTripSelectedEvent.emit(dailyTrip);
    //   this.travelViewPointSelectedEvent.emit(null);
    // }
  }

  protected travelViewPointClicked(travelViewPoint: ITravelViewPointBiz) {
    // this.travelViewPointSelectedEvent.emit(travelViewPoint);
  }

  protected isSelectedDailyTrip(dailyTrip: IDailyTripBiz) {
    // return { 'display': this.selectedDailyTrip && (this.selectedDailyTrip.id === dailyTrip.id) ? 'block' : 'none' };
  }

  protected getDayItemClass(dailyTrip: IDailyTripBiz) {
    // return {
    //   'active': dailyTrip && this.selectedDailyTrip && (dailyTrip.id === this.selectedDailyTrip.id)
    // };
  }

  protected getTravelViewPointItemClass(travelViewPoint: ITravelViewPointBiz) {
    // return {
    //   'active': travelViewPoint && this.selectedTravelViewPoint && travelViewPoint.id === this.selectedTravelViewPoint.id
    // }
  }

  protected deleteTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
    // this.selectedDailyTrip.travelViewPoints = this.selectedDailyTrip.travelViewPoints.
    //   filter(tvp => tvp.id != travelViewPoint.id);
    // this.travelViewPointRemovedEvent.emit(travelViewPoint);
  }

  protected addTravelViewPointReq() {
    // this.travelViewPointAddRequestEvent.emit();
  }

  protected addDay() {
    // this.dailyTripAddedEvent.emit(this.travelAgenda);
  }

  protected deleteDay(dailyTrip: IDailyTripBiz) {
    // this.dailyTripRemovedEvent.emit(dailyTrip);
  }

  //#endregion

   //#region Private method
   private moveViewPoint(e: any) {
    // this._vpScrollRect = this._vpScrollContent.getBoundingClientRect();
    // if (e.clientY < (this._vpScrollRect.top + 10))
    //   this._vpScrollContent.scrollTop -= 10;

    // if (e.clientY > (this._vpScrollRect.bottom - 10))
    //   this._vpScrollContent.scrollTop += 10;
  }

  private moveDay(e: any) {
    // this._dayScrollRect = this._dayScrollContent.getBoundingClientRect();

    // if (e.touches[0].clientY < this._dayScrollRect.top)
    //   this._dayScrollContent.scrollTop -= 10;

    // if (e.touches[0].clientY > this._dayScrollRect.bottom)
    //   this._dayScrollContent.scrollTop += 10;
  }

  private moves(el: any, source: any, handle: any, sibling: any): boolean {
    return (handle.tagName === 'I');
  }

  private onViewPointDrag(el: any, source: any) {
    // this._vpListCmp.sliding = false;
    // this._renderer.removeClass(this._vpScroll.nativeElement, 'scroll-y');
    // this._viewPointDragSub = Observable.interval(100).withLatestFrom(Observable.merge(
    //   Observable.fromEvent<Event>(this._vpScroll.nativeElement, 'mousemove')
    //     .map(e => { e.preventDefault(); return e; }),
    //   Observable.fromEvent<TouchEvent>(this._vpScroll.nativeElement, 'touchmove')
    //     .map(e => e.touches[0])),(count,e) => e)
    //   .subscribe(e => {
    //     this.moveViewPoint(e);
    //   });
  }

  private onDayDrag(el: any, source: any) {
    // this._dayListCmp.sliding = false;
    // this._renderer.removeClass(this._dayScroll.nativeElement, 'scroll-y');
    // this._dayDragSub = Observable.interval(100).withLatestFrom(Observable.merge(
    //   Observable.fromEvent<Event>(this._dayScroll.nativeElement, 'mousemove')
    //     .map(e => { e.preventDefault(); return e; }),
    //   Observable.fromEvent<TouchEvent>(this._dayScroll.nativeElement, 'touchmove')
    //     .map(e => e.touches[0])),(count,e) => e)
    //   .subscribe(e => {
    //     this.moveDay(e);
    //   });
  }

  private onViewPointDragEnd(el: any) {
    // this._vpListCmp.sliding = true;
    // this._renderer.addClass(this._vpScroll.nativeElement, 'scroll-y');
    // this._viewPointDragSub.unsubscribe();
  }

  private onDayDragEnd(el: any) {
    // this._dayListCmp.sliding = true;
    // this._renderer.addClass(this._dayScroll.nativeElement, 'scroll-y');
    // this._dayDragSub.unsubscribe();
  }

  //#endregion
}

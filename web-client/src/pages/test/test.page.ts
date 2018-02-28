import 'rxjs/add/operator/combineLatest';

import { AfterViewInit, Component } from '@angular/core';
import { FabContainer } from 'ionic-angular';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../modules/store/bizModel/filterCategory.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz } from '../../modules/store/bizModel/travelAgenda.biz.model';
import { IViewPointBiz } from '../../modules/store/bizModel/viewPoint.biz.model';
import { CityService } from '../../modules/store/providers/city.service';
import { FilterCategoryService } from '../../modules/store/providers/filterCategory.service';
import { SelectorService } from '../../modules/store/providers/selector.service';
import { TravelAgendaService } from '../../modules/store/providers/travelAgenda.service';
import { ViewPointService } from '../../modules/store/providers/viewPoint.service';

@Component({
  selector: 'page-test',
  templateUrl: 'test.page.html'
})
export class TestPage implements AfterViewInit {

  protected showSearchBar: boolean = false;
  protected showFilterBar: boolean = false;
  public displayModeEnum = DisplayModeEnum;

  //private dailyTrips: Array<IDailyTripBiz> = new Array<IDailyTripBiz>();
  private firstDailyTrip: boolean = true;
  protected displayMode: DisplayModeEnum;

  constructor(private _viewPointService: ViewPointService, 
        private _cityService: CityService,
        private _travelAgendaService: TravelAgendaService, 
        private _filterCategoryService: FilterCategoryService,
        protected selector: SelectorService,) {
    this.displayMode = DisplayModeEnum.Agenda;
  }

  ngAfterViewInit(): void {
    this._cityService.load();
    this._viewPointService.load();
    this._travelAgendaService.load();
    this._filterCategoryService.load();
  }

  dismissSearchBar(): void {
    this.showSearchBar = false;
  }

  displaySearchBar(fab: FabContainer): void {
    this.showSearchBar = true;
    fab.close();
  }

  dismissFilterBar(): void {
    this.showFilterBar = false;
  }

  displayFilterBar(fab: FabContainer): void {
    this.showFilterBar = true;
    fab.close();
  }

  fetchMore(): void {
    //this._cityAction.loadCities(1,50);
   // this._viewPointActionGenerator.loadViewPoints(1, 50);
    //this._travelAgendaAction.loadTravelAgendas();
  }

  changeDailyTrip(): void {
    //this.dayTripSelected$.next(this.dailyTrips[this.firstDailyTrip ? 1 : 0]);
    this.firstDailyTrip = !this.firstDailyTrip;
  }

  clearDailyTrip(): void {
    //this.dayTripSelected$.next(null);
  }

  dailyTripSelected(dailyTrip : IDailyTripBiz) {
    //this.dayTripSelected$.next(dailyTrip);
    this._travelAgendaService.selectDailyTrip(dailyTrip);
  }

  viewPointSelected(viewPoint : IViewPointBiz) {
    this._viewPointService.selectViewPoint(viewPoint);
  }

  dailyTripChanged(value : {dailyTrip : IDailyTripBiz, travelAgenda : ITravelAgendaBiz}) {
    // let dailyTrip = value.dailyTrip;
    // let travelAgeanda = value.travelAgenda;
    // this._travelAgendaService.updateDailyTrip(dailyTrip.id,translateDailyTripFromBiz(dailyTrip));
    // this._travelAgendaService.updateTravelAgenda(travelAgeanda.id,translateTravelAgendaFromBiz(travelAgeanda));
  }

  getDailyTrips(): Array<IDailyTripBiz> {
    let ret = new Array<IDailyTripBiz>();
    // let viewPoints = asMutable(this._store.getState().entities.viewPoints, { deep: true });
    // let dailyTrips = asMutable(this._store.getState().entities.dailyTrips, { deep: true });
    // let travelViewPoints = asMutable(this._store.getState().entities.travelViewPoints, { deep: true });

    // Object.keys(dailyTrips).forEach(key => {
    //   let dailyTrip = dailyTrips[key];
    //   dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(id => travelViewPoints[id]);
    //   Object.keys(dailyTrip.travelViewPoints).forEach(key => {
    //     let travelViewPoint = dailyTrip.travelViewPoints[key];
    //     travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
    //   });
    //   ret.push(dailyTrip);
    // });

    return ret;
  }

  protected criteriaClicked(filterChanged: { category: IFilterCategoryBiz, criteria: IFilterCriteriaBiz }) {
    filterChanged.criteria.isChecked = !filterChanged.criteria.isChecked;

    if (!filterChanged.category.criteries.find(c => !c.isChecked)) {
      filterChanged.category.criteries.forEach(c => {
        c.isChecked = false;
      })
    }

    let checkId: string = null;
    let unCheckIds: Array<string> = new Array<string>();

    filterChanged.category.criteries.forEach(c => {
      if (c.isChecked)
        checkId = c.id;
      else
        unCheckIds.push(c.id);
    });

    this._viewPointService.selectCriteria(checkId, unCheckIds);
  }

  protected searchViewPoint(searchKey: string) {
    this._viewPointService.search(searchKey);
  }

  protected switchDisplayMode() {
    //this._uiActionGeneration.selectTravelAgenda("1");
    // if (this.displayMode === DisplayModeEnum.List)
    //   this.displayMode = DisplayModeEnum.Map;
    // else
    //   this.displayMode = DisplayModeEnum.List;
  }

  protected getSwitchButtonClass() {
    return {
      'map': this.displayMode === DisplayModeEnum.Map,
      'list': this.displayMode === DisplayModeEnum.List
    }
  }

  protected getStyle(expect) {
    return {
      'display': this.displayMode === expect ? 'inline' : 'none'
    }
  }
}

export enum DisplayModeEnum {
  Map,
  List,
  Agenda
}

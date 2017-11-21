import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FabContainer } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { asMutable } from 'seamless-immutable';

import { ViewPointFilterComponent } from '../../components/viewpoint-filter/viewpoint-filter.component';
import { ViewPointSearchComponent } from '../../components/viewpoint-search/viewpoint-search.component';
import { CityAction } from '../../modules/store/entity/city/city.action';
import { FilterCategoryAction } from '../../modules/store/entity/filterCategory/filterCategory.action';
import { IFilterCategory } from '../../modules/store/entity/filterCategory/filterCategory.model';
import { getFilterCategories } from '../../modules/store/entity/filterCategory/filterCategory.selector';
import { TravelAgendaAction } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { IDailyTrip, ITravelAgenda } from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { getTravelAgendas } from '../../modules/store/entity/travelAgenda/travelAgenda.selector';
import { ViewPointAction } from '../../modules/store/entity/viewPoint/viewPoint.action';
import { IViewPoint } from '../../modules/store/entity/viewPoint/viewPoint.model';
import { getViewPoints } from '../../modules/store/entity/viewPoint/viewPoint.selector';
import { IAppState } from '../../modules/store/store.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements AfterViewInit {
  // @ViewChild(ViewPointSearchComponent) private searchBar: ViewPointSearchComponent;
  // @ViewChild(ViewPointFilterComponent) private filterBar: ViewPointFilterComponent;
  
  //@select(['entities','viewPoints'])
  //@select(getViewPoints)
  protected viewPoints$: Observable<Array<IViewPoint>>;
  protected travelAgendas$: Observable<Array<ITravelAgenda>>;
  protected filterCategories$: Observable<Array<IFilterCategory>>;

  protected dayTripSelected$: Subject<IDailyTrip> = new Subject<IDailyTrip>();

  protected showSearchBar : boolean = false;
  protected showFilterBar : boolean = false;

  //@select(['entities','cities'])
  //private cities$ : Observable<Map<string,ICity>>
  private dailyTrips: Array<IDailyTrip> = new Array<IDailyTrip>();
  private firstDailyTrip: boolean = true;


  constructor(private _store: NgRedux<IAppState>,
    private _viewPointAction: ViewPointAction, private _cityAction: CityAction,
    private _travelAgendaAction: TravelAgendaAction, private _filterCategoryAction: FilterCategoryAction) {
    this.viewPoints$ = this._store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints']).map(getViewPoints(this._store));
    this.travelAgendas$ = this._store.select<{ [id: string]: ITravelAgenda }>(['entities', 'travelAgendas']).map(getTravelAgendas(this._store));
    this.filterCategories$ = this._store.select<{ [id: string]: IFilterCategory }>(['entities', 'filterCategories']).map(getFilterCategories(this._store));
  }

  ngAfterViewInit(): void {
    this._cityAction.loadCities();
    this._viewPointAction.loadViewPoints();
    this._travelAgendaAction.loadTravelAgendas();
    this._filterCategoryAction.loadFilterCategories();
    
    this.viewPoints$.subscribe(data => {
      console.log('ViewPoint Changed!');
    })
    this.travelAgendas$.subscribe(data => {
      console.log('Agenda Changed!');
      this.dailyTrips = this.getDailyTrips();
      // if ( this.dailyTrips.length>0)
      //   this.dayTripSelected$.next(this.dailyTrips[0]);
    })
  }

  dismissSearchBar() : void {
    this.showSearchBar = false;
  }
  
  displaySearchBar(fab : FabContainer) : void {
    this.showSearchBar = true;
    fab.close();
  }

  toggleFilter(fab : FabContainer) : void {
    this.showFilterBar = true;
    fab.close();
  }

  fetchMore(): void {
    //this._cityAction.loadCities(1,50);
    this._viewPointAction.loadViewPoints(1, 50);
    //this._travelAgendaAction.loadTravelAgendas();
  }

  changeDailyTrip(): void {
    this.dayTripSelected$.next(this.dailyTrips[this.firstDailyTrip ? 1 : 0]);
    this.firstDailyTrip = !this.firstDailyTrip;
  }

  clearDailyTrip(): void {
    this.dayTripSelected$.next(null);
  }

  getDailyTrips(): Array<IDailyTrip> {
    let ret = new Array<IDailyTrip>();
    let viewPoints = asMutable(this._store.getState().entities.viewPoints, { deep: true });
    let dailyTrips = asMutable(this._store.getState().entities.dailyTrips, { deep: true });
    let travelViewPoints = asMutable(this._store.getState().entities.travelViewPoints, { deep: true });

    Object.keys(dailyTrips).forEach(key => {
      let dailyTrip = dailyTrips[key];
      dailyTrip.travelViewPoints = dailyTrip.travelViewPoints.map(id => travelViewPoints[id]);
      Object.keys(dailyTrip.travelViewPoints).forEach(key => {
        let travelViewPoint = dailyTrip.travelViewPoints[key];
        travelViewPoint.viewPoint = viewPoints[travelViewPoint.viewPoint];
      });
      ret.push(dailyTrip);
    });

    return ret;
  }
}

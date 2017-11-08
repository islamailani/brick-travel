import { NgModule } from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { NgReduxModule, NgRedux } from '@angular-redux/store';

// Redux ecosystem stuff.
import { createLogger } from 'redux-logger';
import { HttpModule } from '@angular/http';

// The top-level reducers and epics that make up our app's logic.
import { rootReducer } from './reducer';
import { RootEpics } from './epic';
import { CityService } from './city/service';
import { CityEpic } from './city/epic';
import { CityAction } from './city/action';
import { IAppState } from './model';
import { ViewPointAction } from './viewPoint/action';
import { ViewPointService } from './viewPoint/service';
import { ViewPointEpic } from './viewPoint/epic';

@NgModule({
    imports: [NgReduxModule,HttpModule],
    providers: [RootEpics,
                CityService,CityEpic,CityAction,
                ViewPointService,ViewPointEpic,ViewPointAction],
})
export class StoreModule {
    constructor(private _store: NgRedux<IAppState>,private _rootEpics: RootEpics) {
        this._store.configureStore(
            rootReducer,
            Object.assign({},{entities: {cities: [],viewPoints: [],viewPointComments: []},error: null,progress: {progressing: false}}),
            [createLogger(), ...this._rootEpics.createEpics()]);
    }
}

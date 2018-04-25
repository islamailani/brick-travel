import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { stateTransformer } from 'redux-seamless-immutable';
import * as Immutable from 'seamless-immutable';

import { throwIfAlreadyLoaded } from '../utils/module-import-guard';
import { EntityEpics } from './entity/entity.epic';
import { CityService } from './providers/city.service';
import { ErrorService } from './providers/error.service';
import { UserService } from './providers/user.service';
import { ViewPointService } from './providers/viewPoint.service';
import { RootEpics } from './store.epic';
import { IAppState, INIT_APP_STATE } from './store.model';
import { rootReducer } from './store.reducer';

export enum EntityTypeEnum {
    CITY = 'CITY',
    VIEWPOINT = 'VIEWPOINT',
    USER = 'USER'
}

const PROVIDERS = [
    ErrorService,
    RootEpics,
    EntityEpics,
    CityService,
    ViewPointService,
    UserService
];

@NgModule({
    imports: [NgReduxModule, HttpClientModule, IonicStorageModule]
})
export class StoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreModule, private _rootEpics: RootEpics,
        private _store: NgRedux<IAppState>) {
        throwIfAlreadyLoaded(parentModule, 'StoreModule');

        this._store.configureStore(
            rootReducer,
            <any>Immutable(INIT_APP_STATE),
            [createLogger({ stateTransformer: stateTransformer }), createEpicMiddleware(this._rootEpics.createEpics())]);
    }
    // ,

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StoreModule,
            providers: [
                ...PROVIDERS
            ]
        };
    }
}

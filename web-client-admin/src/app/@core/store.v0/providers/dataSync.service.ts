import { dispatch, NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MiddlewareAPI } from 'redux';
import { Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, concat, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import {
    DirtyAction,
    DirtyActionPhaseEnum,
    DirtyActionTypeEnum,
    dirtyAddAction,
    dirtyFlushAction,
    dirtyFlushActionFailed,
    dirtyFlushActionFinished,
    dirtyFlushActionStarted,
    dirtyRemoveAction,
    DirtyTypeEnum,
} from '../dirty/dirty.action';
import { EntityTypeEnum, getEntityType } from '../entity/entity.action';
import { IAppState } from '../store.model';
import { CityService } from './city.service';
import { TravelAgendaService } from './travelAgenda.service';

// import * as Observable from 'rxjs/Rx';
@Injectable()
export class DataSyncService {
    private _stateRestored$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    //#region Actions

    private flushDirtyStartedAction = dirtyFlushActionStarted();

    private flushDirtyFinishedAction = dirtyFlushActionFinished();

    private flushDirtyFailedAction = dirtyFlushActionFailed();

    @dispatch()
    private flushDirtyAction = dirtyFlushAction();

    //#endregion

    //#region Constructor
    constructor(private _travelAgendaService: TravelAgendaService, private _cityService: CityService,
        private _storage: Storage, private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Epic
    public createEpic() {
        return this.createFlushEpic();
    }

    public createFlushEpic(): Epic<DirtyAction, IAppState> {
        return (action$, store) => action$
            .ofType(DirtyActionTypeEnum.FLUSH).pipe(
                filter(action => action.meta.phaseType === DirtyActionPhaseEnum.TRIGGER),
                switchMap(action => this.flush(store).pipe(
                    mergeMap((value: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }) =>
                        this.requestFlush(value).pipe(
                            map(data => {
                                // Do nothing while succeed.
                                return { type: 'empty', payload: null, meta: null };
                            }),
                            catchError(error =>
                                of(dirtyAddAction(value.entityType)(value.id, value.type)).pipe(
                                    concat(of(this.flushDirtyFailedAction(error)))
                                )
                            ),
                            startWith(dirtyRemoveAction(value.entityType)(value.id, value.type))
                        )
                    ),
                    startWith(this.flushDirtyStartedAction()),
                    concat(fromPromise(this.persistantState()).pipe(
                        map(() => this.flushDirtyFinishedAction()))
                    )))
            );
    }
    //#endregion

    //#region Public methods
    public async restoreState() {
        const value = await this._storage.get('state');
        return value ? value : {};
    }

    public stateRestored() {
        this._stateRestored$.next(true);
    }

    public syncData() {
        this.flushDirtyAction();
    }

    public isStateRestored(): Observable<boolean> {
        return this._stateRestored$.pipe(filter(value => !!value)).share();
    }

    //#endregion

    //#region Private methods
    private async persistantState() {
        return await this._storage.set('state', this._store.getState());
    }

    private flush(store: MiddlewareAPI<IAppState>): Observable<any> {
        const ret: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }[] = [];

        Object.keys(store.getState().dirties.dirtyIds).forEach(key => {
            Object.keys(store.getState().dirties.dirtyIds[key]).forEach(dirtyType => {
                store.getState().dirties.dirtyIds[key][dirtyType].forEach(id => {
                    ret.push({ entityType: getEntityType(key), type: DirtyTypeEnum[dirtyType.toUpperCase()], id: id });
                });
            });
        });

        return of(...ret);
    }

    private requestFlush(value: { entityType: EntityTypeEnum, type: string, id: string }) {
        const { entityType, type, id } = value;
        switch (entityType) {
            case EntityTypeEnum.TRAVELAGENDA: {
                return this.requestFlushTravelAgenda(type, id);
            }
            case EntityTypeEnum.CITY: {
                return this.requestFlushCity(type, id);
            }
        }
    }

    private requestFlushTravelAgenda(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                return this._travelAgendaService.insertTravelAgenda(id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this._travelAgendaService.updateTravelAgenda(id);
            }
            case DirtyTypeEnum.DELETED: {
                return this._travelAgendaService.deleteTravelAgenda(id);
            }
        }
    }

    private requestFlushCity(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                return this._cityService.insert(id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this._cityService.update(id);
            }
            case DirtyTypeEnum.DELETED: {
                return this._cityService.delete(id);
            }
        }
    }
    //#endregion
}

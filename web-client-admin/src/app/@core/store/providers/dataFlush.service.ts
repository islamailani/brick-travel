import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MiddlewareAPI } from 'redux';
import { Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat, filter, mergeMap, share, startWith, switchMap } from 'rxjs/operators';

import {
    DirtyAction,
    DirtyActionPhaseEnum,
    DirtyActionTypeEnum,
    dirtyFlushAction,
    dirtyFlushActionFailed,
    dirtyFlushActionFinished,
    dirtyFlushActionStarted,
    dirtyRemoveAction,
    DirtyTypeEnum,
} from '../dirty/dirty.action';
import { getEntityType } from '../entity/entity.action';
import { EntityTypeEnum } from '../entity/entity.model';
import { IAppState } from '../store.model';
import { CityService } from './city.service';
import { TravelAgendaService } from './travelAgenda.service';

@Injectable()
export class DataFlushService {
    private _stateRestored$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    //#region Actions

    private flushDirtyStartedAction = dirtyFlushActionStarted();

    private flushDirtyFinishedAction = dirtyFlushActionFinished();

    private flushDirtyFailedAction = dirtyFlushActionFailed();

    private flushDirtyAction = dirtyFlushAction();

    //#endregion

    //#region Constructor
    constructor(private _travelAgendaService: TravelAgendaService, private _cityService: CityService,
        private _storage: Storage, private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Epic
    public createEpic(): any[] {
        return [this.createFlushEpic()];
    }

    private createFlushEpic(): Epic<DirtyAction, IAppState> {
        return (action$, store) => action$
            .ofType(DirtyActionTypeEnum.FLUSH).pipe(
                filter(action => action.payload.phaseType === DirtyActionPhaseEnum.TRIGGER),
                switchMap(action => this.requestFlush(store).pipe(
                    mergeMap((value: { entityType: EntityTypeEnum, type: DirtyTypeEnum, id: string }) => {
                        this.flush(value);
                        return of(dirtyRemoveAction(value.entityType)(value.id, value.type)).pipe(
                            concat(of(this.flushDirtyFinishedAction())),
                            startWith(this.flushDirtyStartedAction())
                        );
                    }))));
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
        this._store.dispatch(this.flushDirtyAction());
    }

    public isStateRestored(): Observable<boolean> {
        return this._stateRestored$.pipe(filter(value => !!value), share());
    }

    //#endregion

    //#region Private methods
    private async persistantState() {
        return await this._storage.set('state', this._store.getState());
    }

    private requestFlush(store: MiddlewareAPI<IAppState>): Observable<any> {
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

    private flush(value: { entityType: EntityTypeEnum, type: string, id: string }) {
        const { entityType, type, id } = value;
        switch (entityType) {
            case EntityTypeEnum.TRAVELAGENDA: {
                return this.requestFlushTravelAgenda(type, id);
            }
        }
    }

    private requestFlushTravelAgenda(type: string, id: string) {
        switch (type) {
            case DirtyTypeEnum.CREATED: {
                return this._travelAgendaService.addById(id);
            }
            case DirtyTypeEnum.UPDATED: {
                return this._travelAgendaService.changeById(id);
            }
            case DirtyTypeEnum.DELETED: {
                return this._travelAgendaService.removeById(id);
            }
        }
    }

    //#endregion
}

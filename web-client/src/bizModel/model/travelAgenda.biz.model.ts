import { ObjectID } from 'bson';

import { EntityPersistentStatusEnum, IPersistentStatus } from '../../modules/store/entity/entity.model';
import {
    IDailyTrip,
    ITravelAgenda,
    ITravelViewPoint,
    TransportationCategory,
} from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPointBiz } from './viewPoint.biz.model';

export interface ITravelAgendaBiz extends IPersistentStatus{
    id: string,
    name: string,
    user: string,
    cover: string,
    dailyTrips: IDailyTripBiz[]
};

export interface IDailyTripBiz {
    id: string,
    travelViewPoints: ITravelViewPointBiz[],
    lastViewPoint: string
}

export interface ITravelViewPointBiz {
    id: string,
    viewPoint: IViewPointBiz,
    distanceToNext: number,
    transportationToNext: TransportationCategory
}

export function caculateDistance(dailyTrip: IDailyTripBiz) {
    if (!dailyTrip || !dailyTrip.travelViewPoints) return;

    for (let i = 0; i < dailyTrip.travelViewPoints.length - 1; i++) {
        let vp = dailyTrip.travelViewPoints[i];
        let vpNext = dailyTrip.travelViewPoints[i + 1];

        vp.distanceToNext = Math.round(new AMap.LngLat(vp.viewPoint.longtitude, vp.viewPoint.latitude).distance(
            new AMap.LngLat(vpNext.viewPoint.longtitude, vpNext.viewPoint.latitude)
        ));

        if (vp.transportationToNext == null) {
            vp.transportationToNext = TransportationCategory.Walking;
        }
    }

    if (dailyTrip.travelViewPoints.length > 0) {
        dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].transportationToNext = null;
        dailyTrip.lastViewPoint = dailyTrip.travelViewPoints[dailyTrip.travelViewPoints.length - 1].id;
    }
    else
        dailyTrip.lastViewPoint = '';
}

export function createTravelAgenda(): ITravelAgendaBiz {
    return {
        id: new ObjectID().toHexString(),
        persistentStatus: EntityPersistentStatusEnum.NEW,
        name: '',
        user: '',
        cover: '',
        dailyTrips: []
    }
}

export function createDailiyTrip(): IDailyTripBiz {
    return {
        id: new ObjectID().toHexString(),
        travelViewPoints: [],
        lastViewPoint: ''
    }
}

export function createTravelViewPoint(viewPoint: IViewPointBiz): ITravelViewPointBiz {
    return {
        id: new ObjectID().toHexString(),
        viewPoint: viewPoint,
        distanceToNext: -1,
        transportationToNext: null
    };
}

export function translateDailyTripFromBiz(dailyTrip: IDailyTripBiz): IDailyTrip {
    return {
        id: dailyTrip.id,
        travelViewPoints: dailyTrip.travelViewPoints.map(tvp => tvp.id)
    };
}

export function translateTravelViewPointFromBiz(travelViewPoint: ITravelViewPointBiz): ITravelViewPoint {
    return {
        id: travelViewPoint.id,
        viewPoint: travelViewPoint.viewPoint.id,
        transportationToNext: travelViewPoint.transportationToNext
    };
}

export function translateTravelAgendaFromBiz(travelAgenda: ITravelAgendaBiz): ITravelAgenda {
    return {
        id: travelAgenda.id,
        persistentStatus: travelAgenda.persistentStatus,
        name: travelAgenda.name,
        user: travelAgenda.user,
        cover: travelAgenda.cover,
        dailyTrips: travelAgenda.dailyTrips.map(dt => dt.id)
    }
}
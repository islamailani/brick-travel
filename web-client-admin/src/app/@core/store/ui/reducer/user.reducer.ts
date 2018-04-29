import { FluxStandardAction } from 'flux-standard-action';
import * as Immutable from 'seamless-immutable';

import { IUserBiz } from '../../bizModel/model/user.biz.model';
import { IActionMetaInfo, IActionPayload } from '../../store.action';
import { INIT_UI_USER_STATE, IUserUI, STORE_UI_USER_KEY } from '../model/user.model';

interface IUIUserActionPayload extends IActionPayload {
    userLoggedIn: string;
}

const defaultUIUserActionPayload: IUIUserActionPayload = {
    userLoggedIn: '',
    error: null,
};

type UIUserAction = FluxStandardAction<IUIUserActionPayload, IActionMetaInfo>;

enum UIUserActionTypeEnum {
    USER_LOGGED_IN = 'UI:USER:USER_LOGGED_IN'
}

export function userLoggedInAction(u: IUserBiz): UIUserAction {
    return {
        type: UIUserActionTypeEnum.USER_LOGGED_IN,
        meta: { progressing: false },
        payload: <any>Object.assign({}, defaultUIUserActionPayload, {
            [STORE_UI_USER_KEY.userLoggedIn]: u ? u.id : ''
        })
    };
}

export function userReducer(state = INIT_UI_USER_STATE, action: UIUserAction): IUserUI {
    switch (action.type) {
        case UIUserActionTypeEnum.USER_LOGGED_IN: {
            return <any>Immutable(state).set(STORE_UI_USER_KEY.userLoggedIn, action.payload[STORE_UI_USER_KEY.userLoggedIn]);
        }
    }
    return <any>state;
}

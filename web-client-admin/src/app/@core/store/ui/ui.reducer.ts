import { combineReducers } from 'redux-seamless-immutable';

import { cityReducer } from './reducer/city.reducer';
import { userReducer } from './reducer/user.reducer';
import { viewPointReducer } from './reducer/viewPoint.reducer';

export const uiReducer =
    combineReducers({
        city: cityReducer,
        viewPoint: viewPointReducer,
        user: userReducer
    });

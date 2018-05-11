import { FluxStandardAction } from 'flux-standard-action';
import * as Immutable from 'seamless-immutable';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IErrorHub, INIT_ERROR_STATE, STORE_ERRORS_KEY } from './error.model';

const MAX_ERRORS = 50;

export function errorReducer(state: IErrorHub = INIT_ERROR_STATE,
    action: FluxStandardAction<IActionPayload, IActionMetaInfo>): IErrorHub {
    if (action.error && action.payload.error) {
        const err = action.payload.error;
        const errorItem = {
            actionId: '',
            network: (err instanceof ErrorEvent),
            description: (err instanceof ErrorEvent) ? err.message : err,
            stack: ''
        };
        if (action.payload.actionId) {
            if (state.errors.length >= MAX_ERRORS) {
                const newErrors = Immutable(state.errors).asMutable();
                newErrors.shift();
                state = Immutable(state).set(STORE_ERRORS_KEY.errors, newErrors);
            }
            state = Immutable(state).set(STORE_ERRORS_KEY.errors, Immutable(state.errors).concat(Object.assign({}, errorItem, {
                actionId: action.payload.actionId
            })));
        }
        state = Immutable(state).set(STORE_ERRORS_KEY.lastError, errorItem);
    } else {
        state = Immutable(state).set(STORE_ERRORS_KEY.lastError, null);
    }
    return state;
}

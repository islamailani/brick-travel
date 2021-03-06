import { FluxStandardAction } from 'flux-standard-action';
import { combineReducers } from 'redux-seamless-immutable';

import { dirtyReducer } from './dirty/dirty.reducer';
import { entityReducer } from './entity/entity.reducer';
import { IActionMetaInfo, IActionPayload } from './store.action';
import { IAppState, IError, IProgress } from './store.model';
import { uiReducer } from './ui/ui.reducer';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer =
  combineReducers<IAppState>({
    entities: entityReducer,
    ui: uiReducer,
    dirties: dirtyReducer,
    progress: progressReducer,
    error: errorReducer
  });

export function progressReducer(state: IProgress = { progressing: false },
  action: FluxStandardAction<IActionPayload, IActionMetaInfo>): IProgress {
  if (action.meta) {
    return { progressing: !!action.meta.progressing };
  }

  return state;
}

export function errorReducer(state: IError = { description: null },
  action: FluxStandardAction<IActionPayload, IActionMetaInfo>): IError {
  if (action.error && action.payload.error) {
    return {
      description: action.payload.error.message || 'Something bad happened',
      stack: action.payload.error.stack
    };
  }

  return state;
}

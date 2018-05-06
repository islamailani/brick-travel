import { FluxStandardAction } from 'flux-standard-action';

export interface IActionMetaInfo {
    progressing: boolean;
}

export interface IActionPayload {
    error: any;
}

// Flux-standard-action gives us stronger typing of our actions.
export type StoreAction = FluxStandardAction<IActionPayload, IActionMetaInfo>;

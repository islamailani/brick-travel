import { Injectable } from '@angular/core';

import { EntityEpics } from './entity/entity.epic';

@Injectable()
export class RootEpics {
  constructor(private _entityEpic: EntityEpics) {}

  public createEpics() {
    return this._entityEpic.createEpics();
  }
}

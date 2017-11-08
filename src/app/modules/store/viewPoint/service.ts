import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { IViewPoint, ViewPointCategory } from './model';
import { normalize } from 'normalizr';
import { viewPoint } from '../schema';

@Injectable()
export class ViewPointService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: Http) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getViewPoints(): Observable<any> {
    return this._http.get('assets/data/viewPoints.json')
    .map(resp => resp.json())
    .map(records => {
      const data = normalize(records.viewPoints, [ viewPoint ]);
      const {viewPoints,comments} = data.entities;
      return {
        viewPoints: Object.keys(viewPoints).map(key => viewPoints[key]),
        viewPointComments: Object.keys(comments).map(key => comments[key])
      };
    })
  }
  //#endregion
}

/* Middleware Calling
var a = (next) => (action) => { console.log('a pre'+ action); next(action); console.log('a after') }
var b = (next) => (action) => { console.log('b pre'+ action); next(action); console.log('b after') }
var c = (next) => (action) => { console.log('c pre'+ action); next(action); console.log('c after') }
var d = (action) => { console.log('hello world' + action) }
var compose = function(...funcs) {return arg => funcs.reduceRight((composed, f) => f(composed), arg);}
compose(a,b,c)(d)('action');
*/
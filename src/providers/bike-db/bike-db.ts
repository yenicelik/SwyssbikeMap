import { Injectable } from '@angular/core';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';

/*
  Generated class for the BikeDbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BikeDbProvider {

  bikeData = [
    {
      bike_no: 1,
      current_user: "0",
      positionLat: 47.3846,
      positionLng: 8.5353,
    },
    {
      bike_no: 2,
      current_user: "0",
      positionLat: 47.3983,
      positionLng: 8.5674,
    },
    {
      bike_no: 3,
      current_user: "0",
      positionLat: 47.3216,
      positionLng: 8.5125
    }
  ];

  bikesList$: FirebaseListObservable<any[]>;

  constructor(public afDB: AngularFireDatabase) {
    console.log('Hello BikeDbProvider Provider');
    try {
      this.bikesList$ = afDB.list('/bikes'); //TODO: change permissions (firebase rules)!!!!
    } catch (e) {
      console.log("Couldn't retrieve contents from firebase bikes!");
      console.log(e)
    }

  }

  creationLoad() {
    console.log("Created bikeDB!");

    this.bikesList$.subscribe(
      (allBikes) => {
        allBikes.map( (sglBike) => {
          console.log(JSON.stringify(sglBike));
          }
        )
      }
    )

  }

  getBikesList() {
    return this.bikesList$;
  }

  updateBikeData(sglBikeData) {
    this.bikesList$.update(String(sglBikeData.bike_no), sglBikeData)
  }



  populateBikeList() {
    this.bikeData.forEach((sglBikeData) => {
      this.bikesList$.update(String(sglBikeData.bike_no), sglBikeData);
    });
  }





}

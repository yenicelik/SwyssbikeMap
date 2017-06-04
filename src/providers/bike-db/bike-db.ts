import {Injectable} from '@angular/core';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';

/*
 Generated class for the BikeDbProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class BikeDbProvider {


    bikesList$: FirebaseListObservable<any[]>;

    constructor(public afDB: AngularFireDatabase) {
        try {
            this.bikesList$ = afDB.list('/bikes'); //TODO: change permissions (firebase rules)!!!!
        } catch (e) {
            console.log("Couldn't retrieve contents from firebase bikes!");
            console.log(e)
        }
    }

    getBikesList() {
        return this.bikesList$;
    }

    updateBikeData(sglBikeData) {
        try {
            this.bikesList$.update(String(sglBikeData.bike_no), sglBikeData);
            return true;
        } catch (e) {
            console.log("Error while trying to update the firebase datase!");
            console.log(e.message);
            console.log(JSON.stringify(sglBikeData));
            return false;
        }
    }
}

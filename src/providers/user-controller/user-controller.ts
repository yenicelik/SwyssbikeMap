import {Injectable} from '@angular/core';
import {BikeDbProvider} from '../bike-db/bike-db';

import {Geolocation} from '@ionic-native/geolocation';


/*
 Generated class for the UserControllerProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserControllerProvider {

    hasABike: any;
    currentBike: any;
    userLocation: any;

    constructor(public bikeDB: BikeDbProvider,
                public geolocation: Geolocation,) {
        console.log('Hello UserControllerProvider Provider');
        this.currentBike = -1;
        this.hasABike = false;
        this.userLocation = null;

        //update user location every few seconds
        setInterval(() => {
            this.updateUserLocation();
        }, 1000);
    }

    updateUserLocation() {
        if (this.geolocation) {
            this.geolocation.getCurrentPosition({maximumAge: 1000, enableHighAccuracy: true}).then((curLocation) => {
                //TODO: Last time I tested this out, it didn't track the user location. Make sure the user location is being tracked successfully
                this.userLocation = {lat: curLocation.coords.latitude, lng: curLocation.coords.longitude}

            }, (error) => {
                console.log("Geolocation service has failed to record User-Location: Exit code 1001");
                console.log(error)
            });
        } else {
            console.log("Geolocation device not found! Exit code 1002");
        }
    }

    markAsBooking(bike_no) {
        this.hasABike = true;
        this.currentBike = bike_no;
    }

    markAsNotBooking() {
        this.hasABike = false;
        this.currentBike = -1
    }

}

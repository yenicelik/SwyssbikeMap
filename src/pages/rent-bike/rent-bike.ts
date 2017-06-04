import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    ViewController,
    AlertController,
    Events
} from 'ionic-angular';

import {BikeDbProvider} from '../../providers/bike-db/bike-db';


/**
 * Generated class for the RentBikePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-rent-bike',
    templateUrl: 'rent-bike.html',
})
export class RentBikePage {

    startData: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public bikeDB: BikeDbProvider,
                public viewCtrl: ViewController,
                public alertCtr: AlertController,
                public events: Events) {
        this.events.subscribe("book:stopBooking", (userBikeNo, locationLat, locationLng) => {
            this.stopBookingBike(userBikeNo, locationLat, locationLng);
        })
    }

    dismiss() {
        //To cancel booking the bike
        this.viewCtrl.dismiss();
    }

    // LOGIC/PROVIDER SPECIFIC CONTROLS
    startBookingBike() {
        this.startData = {
            bike_no: this.navParams.get('bike_no'),
            current_user: "self",
            positionLat: this.navParams.get('lat'),
            positionLng: this.navParams.get('lng')
        };


        //TODO: Check if bike is actually not booked! if yes, send error log and revert back to main page

        this.bikeDB.updateBikeData(this.startData);

        let bookingCodeAlert = this.alertCtr.create({
            title: 'The code for this bike is 4391',
            buttons: ['OK']
        });
        bookingCodeAlert.present();

        //passcode is bike-specific and should be retrieved, never set..
        this.viewCtrl.dismiss({bike_no: 0, success: true, bikeCode: 4391});
    }

    //TODO make sure to move this into the rent-bike.ts somehow!!
    stopBookingBike(userBikeNo, userLocationLat, userLocationLng) {


        //TODO: make sure that bike was booked before it can be returned

        var endData = {
            bike_no: userBikeNo,
            current_user: 0,
            positionLat: userLocationLat + Math.random() * 0.5 - 0.25,
            positionLng: userLocationLng + Math.random() * 0.5 - 0.25
        };

        this.bikeDB.updateBikeData(endData);

        console.log("Stop bike booking with parameters");
        console.log(JSON.stringify(endData));

        return true;

    }

    //TODO: Somehow make sure that this function can be contained within this class, but can be called from the other file..!! Potentially have a callback or so?

    //TODO: make sure that bike was booked before it can be returned

}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public bikeDB: BikeDbProvider,
              public viewCtrl: ViewController,
              public alertCtr: AlertController) {
    console.log("Loading RentBikePage");
    this.bikeDB.creationLoad();
  }

  //UserData will need to be passed on to register who uses the bike. For now, use the current_user:'self' indicating that the bike is in use

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentBikePage');
  }

  // VIEW SPECIFIC CONTROLS
  dismiss() {
    this.viewCtrl.dismiss();
  }

  // LOGIC/PROVIDER SPECIFIC CONTROLS
  startBookingBike() {
    console.log("Starting booking bike: All nav params are");
    console.log(JSON.stringify(this.navParams));

    //TODO: Check if bike is actually not booked! if yes, send error log and revert back to main page

    var saveData = {
      bike_no: 1,
      current_user: "self",
      positionLat: 47.3446,
      positionLng: 8.5253
    };

    this.bikeDB.updateBikeData(saveData);

    let bookingCodeAlert = this.alertCtr.create({
      title: 'The code for this bike is 4391',
      buttons: ['OK']
    });
    bookingCodeAlert.present();

    //passcode is bike-specific and should be retrieved, never set..
    this.viewCtrl.dismiss({bikeNo: 0, success: true, bikeCode: 4391});
  }

  //TODO: Somehow make sure that this function can be contained within this class, but can be called from the other file..!! Potentially have a callback or so?
  /*stopBookingBike() {
   console.log("Stopping booking bike: All nav params are");
   console.log(JSON.stringify(this.navCtrl));

   //TODO: make sure that bike was booked before it can be returned
   var saveData = {
   bike_no: 1,
   current_user: "0",
   positionLat: 47.3546,
   positionLng: 8.5553
   };

   this.bikeDB.updateBikeData(saveData);

   }*/

}

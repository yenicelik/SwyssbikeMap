import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';

import {Diagnostic} from '@ionic-native/diagnostic';

//TODO: This is currently a trash file, need to restructure this after some time

/*
 Generated class for the PermissionControlProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PermissionControlProvider {

  constructor(public diagCtrl: Diagnostic, public platform: Platform) {
    console.log('Hello PermissionControlProvider Provider');
  }

  checkIfLocationAvailable() {
    this.diagCtrl.isLocationEnabled().catch((error) => { //I assume this 'catch' construct is correct.. Should check this though
      console.log("Location is not enabled!");
      console.log(error);
      this.askForLocationPermission();
      return false;
    });

    this.diagCtrl.isLocationAuthorized().catch((error) => {
      console.log("Location is not authorized!");
      console.log(error);
      this.askForLocationPermission();
      return false;
    });

    this.diagCtrl.isLocationAvailable().catch((error) => {
      console.log("Location is not available!");
      console.log(error);
      this.askForLocationPermission();
      return false;
    });

    return true;
  }

  askForLocationPermission() {

    this.diagCtrl.requestLocationAuthorization()
      .then((response) => {
        console.log("Asked for location. Got response: ");
        console.log(response);
      })
      .catch((error) => {
        console.log("Location is not authorized!");
        console.log(error);
        return false;
      });
  }


}

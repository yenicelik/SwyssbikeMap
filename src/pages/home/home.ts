import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, AlertController} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

import {BikeDbProvider} from '../../providers/bike-db/bike-db';

import {RentBikePage} from '../rent-bike/rent-bike';

//One tutorial is from: https://www.christianengvall.se/ionic2-google-maps-markers/

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //TODO: if one has a javascript console, it is not safe to just add a CSS of 'keyboardopen' into it, as stopRidingBike could be invoked. Make sure this is conditioned
  @ViewChild('infoFooter') infoFooter: ElementRef;
  map: any;
  userLocation: any;
  begin: boolean;
  userPositionMarker: any;
  allBikeMarkers: any;

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public bikeDB: BikeDbProvider,
              public modalCtrl: ModalController) {
    console.log("Home page creator loaded");
    this.begin = true;
    this.bikeDB.creationLoad();
    this.bikeDB.populateBikeList();
    console.log("Bikes should be loaded now");
    this.allBikeMarkers = [];
  }

  ionViewDidLoad() {
    console.log("ngAfterViewInit loaded");
    this.infoFooter.nativeElement.classList.add('keyboardopen');

    let mapEle = document.getElementById('map');
    let mapOpt = {
      center: {lat: 47.3769, lng: 8.5417},
      zoom: 11,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      style: [
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    };

    this.map = new google.maps.Map(mapEle, mapOpt);

    console.log("Map initialization started");

    //Zoom to user center only once (potentially have a button that zooms in to the user that changes this variable
    try {
      setInterval(() => {
        this.getUserGeolocation();
        this.addCurLocationAsBike();
        this.removeBikeMarkers();
        this.addBikeMarkers();
      }, 1000 * 20);

    } catch (e) {
      console.log("ERROR WHEN STARTING AND STOPPING BOOKINGBIKE!");
      console.log(e);
      while(true){}
    }



    //TODO: Add only bike markers that are close to your current location

  }

  getUserGeolocation() {
    this.geolocation.getCurrentPosition().then((curGeolocation) => {
      console.log("User location determined");

      if (this.userLocation) {
        this.userLocation = null;
      }

      //TODO: somehow, this doesn't work. It doesn't track the users location
      this.userLocation = new google.maps.LatLng(curGeolocation.coords.latitude, curGeolocation.coords.longitude);
      console.log(JSON.stringify(this.userLocation));

      if (this.userPositionMarker) { //not necessarily the best option
        this.userPositionMarker.setMap(null);
      }

      this.userPositionMarker = new google.maps.Marker({
        position: this.userLocation,
        map: this.map,
        title: 'Your position'
      });

      if (this.begin) {
        this.begin = false;
        this.map.setCenter(this.userLocation);
      }

    }, (error) => {
      console.log("GeoLocation services failed");
      console.log(error);
    });
  }

  addBikeMarkers() {

    this.bikeDB.getBikesList().subscribe(
      (allBikes) => {
        allBikes.map((sglBike) => {
            console.log("Adding bike");
            console.log(JSON.stringify(sglBike));

            if (String(sglBike['current_user']) == "0") {
              var bikePositionMarker = new google.maps.Marker({
                position: {lat: sglBike['positionLat'], lng: sglBike['positionLng']},
                map: this.map,
                title: "Bike" + String(sglBike['bike_no'])
              });

              bikePositionMarker.addListener('click', () => {

                if (this.userLocation) {
                  let bikeModal = this.modalCtrl.create(RentBikePage, {}); //At this stage, don't pass anything to the other page
                  //Action for when modal goes away
                  bikeModal.onDidDismiss((data) => {
                    console.log("End of START BOOKING BIKE");
                    console.log(JSON.stringify(data));
                    this.infoFooter.nativeElement.classList.remove('keyboardopen');
                  });
                  bikeModal.present()
                }
              });



              this.allBikeMarkers.push(bikePositionMarker);
            } else {
              console.log("Bike is in use!");
            }


          }
        )
      }
    );
  }

  addCurLocationAsBike() {
    if (this.userLocation) {
      var bikeData = {
        "bike_no": 10,
        "positionLat": this.userLocation.lat(),
        "positionLng": this.userLocation.lng(),
        "current_user": "self"
      };

      this.bikeDB.updateBikeData(bikeData);
    } else {
      console.log("Location is not available yet!");
    }

  }


  removeBikeMarkers() {
    if (this.allBikeMarkers) {
      this.allBikeMarkers.forEach((sglBikeData) => {
        console.log("Removing bike");
        sglBikeData.setMap(null);
        sglBikeData = null;
      });
      this.allBikeMarkers = [];
    }
  }


  //TODO make sure to move this into the rent-bike.ts somehow!!
  stopBookingBike() {

    //TODO: make sure that bike was booked before it can be returned
    var saveData = {
      bike_no: 1,
      current_user: "0",
      positionLat: 47.3546,
      positionLng: 8.5553
    };

    this.bikeDB.updateBikeData(saveData);
    this.infoFooter.nativeElement.classList.add('keyboardopen');

  }

  /*ngAfterViewInit() {
   this.displayGoogleMap();
   this.getMarkers();
   }
   displayGoogleMap() {
   let latLng = new google.maps.LatLng(57.8127004, 14.2106225);

   let mapOptions = {
   center: latLng,
   disableDefaultUI: true,
   zoom: 11,
   mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

   }

   addMarkersToMap(markers) {
   for (let marker of markers) {
   var position = new google.maps.LatLng(marker.latitude, marker.longitude);
   var dogwalkMarker = new google.maps.Marker({position: position, title: marker.title});
   dogwalkMarker.setMap(this.map);
   }
   }

   getMarkers() {
   this.http.get('assts/data/markers.json')
   .map((res) => res.json())
   .subscribe((data) => {
   this.addMarkersToMap(data);
   })
   }
   */
}



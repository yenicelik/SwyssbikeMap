import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

import {BikeDbProvider} from '../../providers/bike-db/bike-db';

//One tutorial is from: https://www.christianengvall.se/ionic2-google-maps-markers/

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  userLocation: any;
  begin: boolean;
  userPositionMarker: any;
  allBikeMarkers: any;

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public bikeDB: BikeDbProvider) {
    console.log("Home page creator loaded");
    this.begin = true;
    this.bikeDB.creationLoad();
    this.bikeDB.populateBikeList();
    console.log("Bikes should be loaded now");
    this.allBikeMarkers = [];
  }

  ionViewDidLoad() {
    console.log("ngAfterViewInit loaded");

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
    setInterval(() => {
     this.getUserGeolocation();
     /*this.addCurLocationAsBike();*/
     this.removeBikeMarkers();
     this.addBikeMarkers();
     }, 1000 * 3);


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
      console.log(this.userLocation);

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

            var bikePositionMarker = new google.maps.Marker({
              position: {lat: sglBike['positionLat'], lng: sglBike['positionLng']},
              map: this.map,
              title: "Bike" + String(sglBike['bike_no'])
            });

            this.allBikeMarkers.push(bikePositionMarker);
          }
        )
      }
    );
  }

  /*addCurLocationAsBike() {
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


  }*/


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



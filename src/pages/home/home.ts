import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController,
    ModalController,
    AlertController,
    Events
} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

import {BikeDbProvider} from '../../providers/bike-db/bike-db';
import {RentBikePage} from '../rent-bike/rent-bike';
import {UserControllerProvider} from '../../providers/user-controller/user-controller';

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
    allBikeMarkers: any = [];
    didBook: boolean = false;


    constructor(public navCtrl: NavController,
                public geolocation: Geolocation,
                public bikeDB: BikeDbProvider,
                public modalCtrl: ModalController,
                public alertCtrl: AlertController,
                public events: Events,
                public userCtrl: UserControllerProvider) {
        this.begin = true;
        console.log("Bikes should be loaded now");
    }


    ionViewDidLoad() {
        console.log("ngAfterViewInit loaded");
        this.infoFooter.nativeElement.classList.add('keyboardopen');

        //Add Google map
        let mapEle = document.getElementById('map');
        let mapOpt = {
            center: {lat: 47.3769, lng: 8.5417},
            zoom: 8,
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


        //Update markers repeatedly
        try {
            this.centerMapToUser();
            setInterval(() => {
                this.removeBikeMarkers();
                this.addBikeMarkers();
            }, 1000 * 1);
            if (this.userCtrl.userLocation) {
                this.map.setCenter(this.userCtrl.userLocation);
            }

        } catch (e) {
            console.log("ERROR WHEN STARTING AND STOPPING BOOKINGBIKE!");
            console.log(e);
        }


    }

    addUserMarker() {
        if (this.userPositionMarker) {
            this.userPositionMarker.setMap(null);
        }
        this.userPositionMarker = new google.maps.Marker({
            position: this.userCtrl.userLocation,
            map: this.map,
            title: 'Your position'
        });

        //Zoom to user location if beginning
        if (this.begin) {
            this.begin = false;
            this.map.setCenter(this.userCtrl.userLocation);
        }

    }


    centerMapToUser() {
        if (this.userCtrl.userLocation) {
            this.map.setCenter(this.userCtrl.userLocation);

        }
    }


    alertTryingToBookTwice() {
        let alreadyBooked = this.alertCtrl.create({
            title: 'Already biking!',
            subTitle: 'You are already riding a bike and cannot book more',
            buttons: ['Ok']
        });
        alreadyBooked.present();
    }


    modalGoToBookingPage(bike_no) {
        let bikeModal = this.modalCtrl.create(RentBikePage, {
            bike_no: bike_no,
            lat: this.userCtrl.userLocation.lat,
            lng: this.userCtrl.userLocation.lng
        }); //At this stage, don't pass anything to the other page
        //Action for when modal goes away
        bikeModal.onDidDismiss((data) => {

            //In case dismiss was a booking confirmation
            if (data) {
                console.log("End of START BOOKING BIKE");
                console.log(JSON.stringify(data));
                this.infoFooter.nativeElement.classList.remove('keyboardopen');
                this.userCtrl.markAsBooking(bike_no);
                //In case dismiss was cancelling (returning from) the booking (site)
            } else {
                console.log("Booking was cancelled");
            }
        });
        bikeModal.present()
    }


    addBikeMarkers() {
        this.bikeDB.getBikesList().subscribe((allBikes) => {
            allBikes.forEach(
                (sglBike) => {
                    console.log("Single bike");
                    console.log(sglBike['current_user']);
                    console.log(sglBike['bike_no']);
                    if (sglBike['current_user'] === 0) {
                        var bikePositionMarker = new google.maps.Marker({
                            position: {lat: sglBike['positionLat'], lng: sglBike['positionLng']},
                            map: this.map,
                            title: "Bike" + String(sglBike['bike_no'])
                        });

                        bikePositionMarker.addListener('click', () => {
                            //TODO: In-between refreshing markers, this action depends on the conditional
                            if (this.userCtrl.hasABike) {
                                this.alertTryingToBookTwice();
                            } else if (this.userCtrl.userLocation) {
                                this.modalGoToBookingPage(sglBike['bike_no']);
                            }
                        });

                        this.allBikeMarkers.push(bikePositionMarker);

                    } else if (sglBike['current_user'] != 0) {
                        console.log("Bike number " + String(sglBike['bike_no']) + " is in use by user is: " + String(sglBike['current_user']));
                    }
                }
            );
        });

    }

    removeBikeMarkers() {/*
        if (this.allBikeMarkers) {
            this.allBikeMarkers.map((sglBikeData) => {
                sglBikeData.setMap(null);
                sglBikeData = null;
            });
            this.allBikeMarkers = [];
        }*/
    }


    stopBookingBike() {
        this.events.publish("book:stopBooking", this.userCtrl.currentBike, this.userCtrl.userLocation.lat, this.userCtrl.userLocation.lng);
        //THIS must happen AFTER the upper function!
        this.userCtrl.markAsNotBooking();
        this.infoFooter.nativeElement.classList.add('keyboardopen');
    }


}



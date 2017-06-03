import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentBikePage } from './rent-bike';

@NgModule({
  declarations: [
    RentBikePage,
  ],
  imports: [
    IonicPageModule.forChild(RentBikePage),
  ],
  exports: [
    RentBikePage
  ]
})
export class RentBikePageModule {}

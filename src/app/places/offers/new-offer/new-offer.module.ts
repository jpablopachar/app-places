import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewOfferPageRoutingModule } from './new-offer-routing.module';
import { NewOfferPage } from './new-offer.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    SharedModule
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PlacesPageRoutingModule } from './places-routing.module';
import { PlacesPage } from './places.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PlacesPageRoutingModule
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}

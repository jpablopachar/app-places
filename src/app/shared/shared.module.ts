import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LocationPickerComponent, MapModalComponent]
})
export class SharedModule { }

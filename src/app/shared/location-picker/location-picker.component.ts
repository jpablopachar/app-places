import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/places/location';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  private gmApiKey = environment.googleMapsApiKey;
  public selectedLocationImage: string;
  public isLoading = false;

  constructor(
    private readonly http: HttpClient,
    private readonly modalCtrl: ModalController,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly alertCtrl: AlertController
  ) { }

  public onPickLocation(): void {
    this.actionSheetCtrl.create({
      header: 'Please Choose',
      buttons: [
        {
          text: 'Auto-Locate',
          handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Pick on Map',
          handler: () => {
            this.openMap();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => actionSheetEl.present());
  }

  private openMap(): void {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalElm) => {
      modalElm.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }

        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };

        this.createPlace(coordinates.lat, coordinates.lng);
      });

      modalElm.present();
    });
  }

  private locateUser(): void {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();

      return;
    }

    this.isLoading = true;

    Plugins.Geolocation.getCurrentPosition().then((geoPosition) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };

      this.createPlace(coordinates.lat, coordinates.lng);

      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  private createPlace(lat: number, lng: number): void {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null
    };

    this.isLoading = true;

    this.getAddress(lat, lng).pipe(
      switchMap((address) => {
        pickedLocation.address = address;

        return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
      })
    ).subscribe((staticMapImageUrl) => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  }

  private getAddress(lat: number, lng: number): Observable<any> {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          this.gmApiKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private showErrorAlert(): void {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(alertElm => alertElm.present());
  }

  private getMapImage(lat: number, lng: number, zoom: number): string {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${this.gmApiKey}`;
  }
}

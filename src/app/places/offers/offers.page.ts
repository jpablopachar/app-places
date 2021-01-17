import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place';
import { PlaceService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  private placesSubs: Subscription;
  public offers: Place[];
  public isLoading = false;

  constructor(
    private readonly router: Router,
    private readonly placesService: PlaceService
  ) { }

  ngOnInit(): void {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter(): void {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  public onEdit(offerId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy(): void {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }
}

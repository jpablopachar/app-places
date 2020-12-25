import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Place } from '../place';
import { PlaceService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  private placesSubs: Subscription;
  public loadedPlaces: Place[];
  public listedLoadedPlaces: Place[];
  public relevantPlaces: Place[];
  public isLoading = false;

  constructor(
    private readonly menuCtrl: MenuController,
    private readonly placesService: PlaceService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter(): void {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  public onOpenMenu(): void {
    this.menuCtrl.toggle();
  }

  public onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userId !== this.authService.userId
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy(): void {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }
}

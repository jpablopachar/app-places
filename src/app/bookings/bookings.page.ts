import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  private bookingSubs: Subscription;
  public loadedBookings: Booking[];
  public isLoading = false;

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.bookingSubs = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter(): void {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  public onCancelBooking(bookingId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then((loadingEl) => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }
}

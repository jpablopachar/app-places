import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private urlApi = environment.firebaseApi;
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ): Observable<Booking[]> {
    let generatedId: string;
    const newBooking = new Booking(
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo,
      Math.random().toString()
    );
    return this.http
      .post<{ name: string }>(`${this.urlApi}/bookings.json`, {
        ...newBooking,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string): Observable<Booking[]> {
    return this.http.delete(`${this.urlApi}/bookings/${bookingId}.json`).pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }

  fetchBookings(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: Booking }>(
        `${this.urlApi}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((bookingData) => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo),
                  key
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
  }
}

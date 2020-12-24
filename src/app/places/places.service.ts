import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Place } from './place';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private urlApi = environment.firebaseApi;
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  public get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  public fetchPlaces(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: Place }>(`${this.urlApi}/offered-places.json`)
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  key
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  public getPlace(id: string): Observable<Place> {
    return this.http
      .get<Place>(`${this.urlApi}/offered-places/${id}.json`)
      .pipe(
        map((placeData) => {
          return new Place(
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            id
          );
        })
      );
  }

  public addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ): Observable<Place[]> {
    let generatedId: string;
    const newPlace = new Place(
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      Math.random().toString()
    );
    return this.http
      .post<{ name: string }>(`${this.urlApi}/offered-places.json`, {
        ...newPlace,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  public updatePlace(
    placeId: string,
    title: string,
    description: string
  ): Observable<object> {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.id
        );
        return this.http.put(`${this.urlApi}/offered-places/${placeId}.json`, {
          ...updatedPlaces[updatedPlaceIndex],
          id: null,
        });
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}

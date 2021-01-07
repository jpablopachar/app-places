import { PlaceLocation } from './location';

export class Place {
  constructor(
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public id?: string,
    public location?: PlaceLocation,
  ) { }
}

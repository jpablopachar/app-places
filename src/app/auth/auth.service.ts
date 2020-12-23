import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'abc';

  constructor() {}

  public get userIsAuthenticated(): boolean {
    return this._userIsAuthenticated;
  }

  public get userId(): string {
    return this._userId;
  }

  public login(): void {
    this._userIsAuthenticated = true;
  }

  public logout(): void {
    this._userIsAuthenticated = false;
  }
}

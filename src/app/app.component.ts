import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private readonly platform: Platform,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.initializeApp();
  }

  public initializeApp(): void {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { Cookie } from '../../utils/cookie';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor( private  router: Router, private cookie: Cookie) {
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    return this.checkLogin( state.url );
  }

  checkLogin( url: string ) {
    if ( !this.cookie.getCookie( 'access_token' ) ) {
      window.location.href = environment.host;
      return false;
    }
    return true;
  }
}

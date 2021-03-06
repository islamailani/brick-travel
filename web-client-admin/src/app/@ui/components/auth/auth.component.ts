import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators/takeWhile';

import { AuthService } from '../../../@core/auth/providers/authService';

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
@Component({
  selector: 'bt-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
        <nz-card>
            <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
              <router-outlet></router-outlet>
            </div>
        </nz-card>
  `,
})
export class AuthComponent implements OnDestroy {

  private alive = true;

  subscription: any;

  authenticated = false;
  token = '';

  // showcase of how to use the onAuthenticationChange method
  constructor(protected auth: AuthService) {

    this.subscription = auth.onAuthenticationChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

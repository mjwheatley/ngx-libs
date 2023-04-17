import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '@mawhea/ngx-core';
import { ISingleSignOnConfig } from '../../utils';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-single-sign-on',
  templateUrl: './single-sign-on.component.html',
  styleUrls: ['./single-sign-on.component.scss']
})
export class SingleSignOnComponent implements OnInit {
  @Input() config: ISingleSignOnConfig;

  constructor(
    private loadingService: LoadingService
  ) {
  }

  async ngOnInit() {
  }

  async sso() {
    this.loadingService.setIsLoading(true);
    await Auth.federatedSignIn({ customProvider: `Mawhea` });
  }
}

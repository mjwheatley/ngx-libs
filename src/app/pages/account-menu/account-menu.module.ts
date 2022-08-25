import { NgModule } from '@angular/core';
import { AccountMenuPageRoutingModule } from './account-menu-routing.module';
import { AccountMenuPage } from './account-menu.page';
import { SharedModule } from '../../shared.module';
import { SharedModule as NgxCameraSharedModule } from '@mawhea/ngx-camera';

@NgModule({
  imports: [
    SharedModule,
    AccountMenuPageRoutingModule,
    NgxCameraSharedModule
  ],
  declarations: [AccountMenuPage]
})
export class AccountMenuPageModule {
}

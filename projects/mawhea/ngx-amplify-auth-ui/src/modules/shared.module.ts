import { NgModule } from '@angular/core';
import { SharedModule as CoreSharedModule } from '@mawhea/ngx-core';
import { DateOfBirthComponent, DateOfBirthInputsComponent, PhoneNumberComponent } from '../components';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';

@NgModule({
  imports: [
    CoreSharedModule,
    NgxMatIntlTelInputModule
  ],
  declarations: [
    DateOfBirthComponent,
    DateOfBirthInputsComponent,
    PhoneNumberComponent
  ],
  exports: [
    CoreSharedModule,
    DateOfBirthComponent,
    DateOfBirthInputsComponent,
    PhoneNumberComponent
  ]
})
export class SharedModule {
}

import { NgModule } from '@angular/core';
import { SharedModule as CoreSharedModule } from '@mawhea/ngx-core';
import {
  DateOfBirthComponent,
  DateOfBirthInputsComponent,
  PhoneNumberComponent
} from '../components';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

@NgModule({
  imports: [
    CoreSharedModule,
    NgxMatIntlTelInputComponent
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
    PhoneNumberComponent,
    NgxMatIntlTelInputComponent
  ]
})
export class SharedModule {
}

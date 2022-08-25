import { NgModule } from '@angular/core';
import { SharedModule as CoreSharedModule } from '@mawhea/ngx-core';
import { AddImageComponent } from '../components';
import { CameraModalComponent } from '../modals';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    CoreSharedModule,
    WebcamModule
  ],
  declarations: [
    AddImageComponent,
    CameraModalComponent
  ],
  exports: [
    CoreSharedModule,
    AddImageComponent,
    CameraModalComponent
  ]
})
export class SharedModule {
}

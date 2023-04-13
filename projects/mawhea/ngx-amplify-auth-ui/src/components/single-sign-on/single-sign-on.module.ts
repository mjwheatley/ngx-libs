import { NgModule } from '@angular/core';
import { SharedModule as CoreSharedModule } from '@mawhea/ngx-core';
import { SingleSignOnComponent } from './single-sign-on.component';

@NgModule({
  imports: [
    CoreSharedModule
  ],
  declarations: [
    SingleSignOnComponent
  ],
  exports: [
    SingleSignOnComponent
  ]
})
export class SingleSignOnModule {
}

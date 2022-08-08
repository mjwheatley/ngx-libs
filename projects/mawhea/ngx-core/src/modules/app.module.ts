import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Storage } from '@ionic/storage';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  LoadingService,
  SessionService, TranslateNpmModulesService
} from '../services';
import { TranslateNpmModulesLoader } from '../utils';
import { AuthService } from '../auth';

export const createTranslateLoader = (
  http: HttpClient,
  translateNpmModulesService: TranslateNpmModulesService
) => new TranslateNpmModulesLoader(http, translateNpmModulesService);

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    LoadingService,
    SessionService,
    Storage,
    TranslateNpmModulesService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ]
})
export class AppModule {
}

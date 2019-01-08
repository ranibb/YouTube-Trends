/* Core */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageServiceModule } from 'ngx-webstorage-service';

/* Material UI */
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';

/* Application routes */
import { ROUTES } from './app.routes';

/* Components/Services/Pipes */
import { AppComponent } from './app.component';
import { ContextService } from '@shared/context.service';
import { HeaderComponent } from '@shared/header/header.component';
import { SlideFiltersComponent } from '@shared/slide-filters/slide-filters.component';
import { WINDOW_PROVIDERS } from './service/window.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SlideFiltersComponent
  ],
  imports     : [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatSliderModule,
    StorageServiceModule,
    MatSlideToggleModule,
    RouterModule.forRoot(ROUTES, {
      useHash           : Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  providers   : [ ContextService, WINDOW_PROVIDERS ],
  bootstrap   : [ AppComponent ]
})

export class AppModule {
}

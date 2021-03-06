import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';

import { AMapComponent } from './components/a-map/a-map.component';
import { InformationWindowComponent } from './components/a-map/information-window/information-window.component';
import { RateComponent } from './components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from './components/a-map/viewpoint-marker/viewpoint-marker.component';
import { AuthBlockComponent } from './components/auth/auth-block.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchComponent } from './components/search-input/search.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { TwoColumnsLayoutComponent } from './layouts/two-columns/two-columns.layout';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { SearchService } from './providers/search.service';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DEFAULT_THEME } from './styles/theme.default';
import { TravelAgendaComponent } from './components/travelAgenda/travelAgenda.component';
import { DragulaDirective } from './directives/dragula.directive';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const ADDON_MODULES = [
  NgbModule,
  ToasterModule,
  NgZorroAntdModule
];

const COMPONENTS = [
  AuthBlockComponent,
  AuthComponent,
  LoginComponent,
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  SearchInputComponent,
  SearchComponent,
  TwoColumnsLayoutComponent,
  ModalComponent,
  AutofocusDirective,
  AMapComponent,
  InformationWindowComponent,
  RateComponent,
  ViewPointMarkerComponent,
  TravelAgendaComponent,
  DragulaDirective
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
];

const PROVIDERS = [
  ...ToasterModule.forRoot().providers,
  ...NgZorroAntdModule.forRoot().providers,
  SearchService
];

const ENTRY_COMPONENTS = [
  AMapComponent,
  InformationWindowComponent,
  ViewPointMarkerComponent,
  SearchInputComponent,
  ModalComponent,
  LoginComponent,
  AuthComponent
];

@NgModule({
  imports: [...BASE_MODULES, ...ADDON_MODULES],
  exports: [...BASE_MODULES, ...ADDON_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class UIModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: UIModule,
      providers: [...PROVIDERS],
    };
  }
}

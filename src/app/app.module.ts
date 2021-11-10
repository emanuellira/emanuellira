/** [# version: 6.4.8 #] */
/** Imports */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
/** Services */
import { LoginInterceptorService } from './services/login-interceptor.service';
/** Directives */
import { FormErrorDirective } from './directives/form-error.directive';
/** Routing */
import { AppRoutingModule } from './app-routing.module';
/** Components */
import { AppComponent } from './app.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageRevisionComponent } from './pages/page-revision/page-revision.component';
import { PageOptionsComponent } from './pages/page-options/page-options.component';
import { PageEventosComponent } from './pages/page-eventos/page-eventos.component';
import { PageUsuariosComponent } from './pages/page-usuarios/page-usuarios.component';
import { ItemMenuOptionsComponent } from './components/tools/item-menu-options/item-menu-options.component';
import { PageCatalogosComponent } from './pages/page-catalogos/page-catalogos.component';
import { PageCerrarSesionComponent } from './pages/page-cerrar-sesion/page-cerrar-sesion.component';
import { DynamicTableComponent } from './components/tools/dynamic-table/dynamic-table.component';
import { DynamicTableDirective } from './directives/dynamic-table.directive';
import { AlertsComponent } from './components/tools/alerts/alerts.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HeaderInfoComponent } from './components/shared/header-info/header-info.component';
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { SizeWindowDirective } from './directives/size-window.directive';
import { AppEditComponent } from './components/app-edit/app-edit.component';
import { ToolCheckComponent } from './components/tools/tool-check/tool-check.component';
import { ToolDateComponent } from './components/tools/tool-date/tool-date.component';
import { ToolImageComponent } from './components/tools/tool-image/tool-image.component';
import { ToolInputComponent } from './components/tools/tool-input/tool-input.component';
import { ToolSelectComponent } from './components/tools/tool-select/tool-select.component';
import { ToolTextareaComponent } from './components/tools/tool-textarea/tool-textarea.component';
import { BvsuiteCreateUploadNotifyComponent } from './components/shared/Biblioteca/bvsuite-create-upload-notify/bvsuite-create-upload-notify.component';
import { BvsuiteCreateComponent } from './components/shared/Biblioteca/bvsuite-create-upload-notify/bvsuite-create/bvsuite-create.component';
import { ToolUploadcatalogoComponent } from './components/tools/tool-uploadcatalogo/tool-uploadcatalogo.component';
import { ToolItemcatalogoComponent } from './components/tools/tool-itemcatalogo/tool-itemcatalogo.component';
import { ToolEntrevistadoDataComponent } from './components/tools/tool-entrevistado-data/tool-entrevistado-data.component';
import { ToolCapturistaDataComponent } from './components/tools/tool-capturista-data/tool-capturista-data.component';
import { FootersComponent } from './components/shared/footers/footers.component';
import { ToolLabelFootersComponent } from './components/shared/tool-label-footers/tool-label-footers.component';
import { ToolListaSectoresComponent } from './components/tools/tool-lista-sectores/tool-lista-sectores.component';
import { FnumberPipe } from './pipes/fnumber.pipe';
import { FstepperPipe } from './pipes/fstepper.pipe';
import { FswitchPipe } from './pipes/fswitch.pipe';
import { ToolVerMasComponent } from './components/tools/tool-ver-mas/tool-ver-mas.component';
import { ToolAyudaComponent } from './components/tools/tool-ayuda/tool-ayuda.component';
import { ToolPasoComponent } from './components/tools/tool-paso/tool-paso.component';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';
import { PageIndicadoresComponent } from './pages/page-indicadores/page-indicadores.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/tools/bar-chart/bar-chart.component';
import { ToolStepperComponent } from './components/tools/tool-stepper/tool-stepper.component';
import { BvsuiteCreateFilterComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { BvsuiteFilterUbicacionComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-filter-ubicacion/bvsuite-filter-ubicacion.component';
import { BvsuiteFilterEducativoComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-filter-educativo/bvsuite-filter-educativo.component';
import { BvsuiteFilterDanioComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-filter-danio/bvsuite-filter-danio.component';
import { BvsuiteFilterAmbienteComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-filter-ambiente/bvsuite-filter-ambiente.component';
import { BvsuiteFilterMatriculaComponent } from './components/shared/Biblioteca/bvsuite-create-filter/bvsuite-filter-matricula/bvsuite-filter-matricula.component';
import { ToolSliderComponent } from './components/tools/tool-slider/tool-slider.component';
import { FsliderPipe } from './pipes/fslider.pipe';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoginInterceptorService,
    multi: true,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    PageLoginComponent,
    FormErrorDirective,
    PageRevisionComponent,
    PageOptionsComponent,
    PageEventosComponent,
    PageUsuariosComponent,
    ItemMenuOptionsComponent,
    PageCatalogosComponent,
    PageCerrarSesionComponent,
    DynamicTableComponent,
    DynamicTableDirective,
    AlertsComponent,
    NavbarComponent,
    HeaderInfoComponent,
    DomseguroPipe,
    SizeWindowDirective,
    AppEditComponent,
    ToolCheckComponent,
    ToolDateComponent,
    ToolImageComponent,
    ToolInputComponent,
    ToolSelectComponent,
    ToolTextareaComponent,
    ToolUploadcatalogoComponent,
    BvsuiteCreateUploadNotifyComponent,
    BvsuiteCreateComponent,
    ToolEntrevistadoDataComponent,
    ToolCapturistaDataComponent,
    FootersComponent,
    ToolLabelFootersComponent,
    ToolItemcatalogoComponent,
    ToolListaSectoresComponent,
    FnumberPipe,
    FstepperPipe,
    FswitchPipe,
    ToolVerMasComponent,
    ToolAyudaComponent,
    PageIndicadoresComponent,
    BarChartComponent,
    ToolStepperComponent,
    ToolPasoComponent,
    SafeHTMLPipe,
    BvsuiteCreateFilterComponent,
    BvsuiteFilterUbicacionComponent,
    BvsuiteFilterEducativoComponent,
    BvsuiteFilterDanioComponent,
    BvsuiteFilterAmbienteComponent,
    BvsuiteFilterMatriculaComponent,
    ToolSliderComponent,
    FsliderPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
  ],
  providers: [httpInterceptorProviders, AlertsComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

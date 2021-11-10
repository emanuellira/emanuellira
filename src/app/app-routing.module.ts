/** [# version: 6.0.4 #] */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

import { PageEventosComponent } from './pages/page-eventos/page-eventos.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageOptionsComponent } from './pages/page-options/page-options.component';
import { PageRevisionComponent } from './pages/page-revision/page-revision.component';

import { PageUsuariosComponent } from './pages/page-usuarios/page-usuarios.component';
import { PATH_ } from './global/globals';
import { PageCatalogosComponent } from './pages/page-catalogos/page-catalogos.component';
import { PageCerrarSesionComponent } from './pages/page-cerrar-sesion/page-cerrar-sesion.component';
import { PageIndicadoresComponent } from './pages/page-indicadores/page-indicadores.component';


const routes: Routes = [
  {
    path: PATH_._USUARIOS_,
    component: PageUsuariosComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._EVENTOS_,
    component: PageEventosComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._INDICADORES_,
    component: PageIndicadoresComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._OPTIONS_,
    component: PageOptionsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._REVISION_,
    component: PageRevisionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._CATALOGOS_,
    component: PageCatalogosComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATH_._CERRAR_SESION_,
    component: PageCerrarSesionComponent,
    canActivate: [AuthGuardService],
  },
  { path: PATH_._LOGIN_, component: PageLoginComponent },
  { path: '**', component: PageLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { UploadComponent } from './components/upload/upload.component';
import { ChartGeneratorComponent } from './components/chart-generator/chart-generator.component';
// import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponentComponent,
    children: [
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'chart-generator',
        component: ChartGeneratorComponent
      }
    ]
  },
  // {
  //   path: 'login',
  //   component: LoginComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

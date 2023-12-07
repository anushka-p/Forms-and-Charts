import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { UploadComponent } from './components/upload/upload.component';
import { ChartGeneratorComponent } from './components/chart-generator/chart-generator.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';

import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { HttpClientModule } from '@angular/common/http';
import { SharedDataService } from './services/shared-data.service';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
registerPlugin(FilePondPluginFileValidateType);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponentComponent,
    UploadComponent,
    ChartGeneratorComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FilePondModule,
    HttpClientModule,
    DragDropModule,
    HighchartsChartModule,
    FormsModule,
  ],
  providers: [SharedDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}

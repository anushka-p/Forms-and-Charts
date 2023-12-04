import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App1RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EditOrCreateUserComponent } from './components/edit-or-create-user/edit-or-create-user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsComponent } from './components/forms/forms.component';
import { RoughComponent } from './components/rough/rough.component';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { SubmittedFormsComponent } from './components/submitted-forms/submitted-forms.component';
import { ToSubmitFormsComponent } from './components/to-submit-forms/to-submit-forms.component';
import { DisplayFormsComponent } from './components/display-forms/display-forms.component';
import { OtherSubmissionsComponent } from './components/other-submissions/other-submissions.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AdminViewFormsComponent } from './components/admin-view-forms/admin-view-forms.component';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserHomeComponent,
    AdminHomeComponent,
    LayoutComponent,
    EditOrCreateUserComponent,
    RoughComponent,
    FormsComponent,
    SubmittedFormsComponent,
    ToSubmitFormsComponent,
    DisplayFormsComponent,
    OtherSubmissionsComponent,
    ErrorModalComponent,
    UploadFileComponent,
    AdminViewFormsComponent,
   
  ],
  imports: [
   CommonModule,
    App1RoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

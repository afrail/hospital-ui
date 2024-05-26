import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import { SubmitConfirmationDialogComponent } from './components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectSearchComponent} from './components/mat-select-search/mat-select-search.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ApprovalSubmitDialogComponent} from './components/approval-dialog/approval-submit-dialog/approval-submit-dialog.component';
import {ApprovalHistoryDialogComponent} from './components/approval-dialog/approval-history-dialog/approval-history-dialog.component';
import {ApprovalBackDialogComponent} from './components/approval-dialog/approval-back-dialog/approval-back-dialog.component';
import { SelectBanglaDateComponent } from './components/select-bangla-date/select-bangla-date.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule} from '@angular/material/core';
import {FuseCardModule} from '../../../@fuse/components/card';
import {HttpClientModule} from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {NgApexchartsModule} from 'ng-apexcharts';
import {TableColumnExcludeSelectPipe} from './filters/ table-column-exclude-select.pipe';
import {MatSelectSearchSmallComponent} from './components/mat-select-search-small/mat-select-search-small.component';


const _materialModule = [

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatChipsModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatSortModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatGridListModule,
    MatMenuModule,


];

const _allModule = [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule,
    TranslateModule.forRoot(),
    NgxMatSelectSearchModule,
    HttpClientModule,
    FuseCardModule,
    RouterModule,
    DragDropModule,
    CKEditorModule,
    NgApexchartsModule,

    _materialModule,
];

const _allComponent = [
    SubmitConfirmationDialogComponent,
    MatSelectSearchComponent,
    MatSelectSearchSmallComponent,
    SelectBanglaDateComponent,
    ApprovalSubmitDialogComponent,
    ApprovalHistoryDialogComponent,
    ApprovalBackDialogComponent,
    TableColumnExcludeSelectPipe,
];

@NgModule({
    providers: [DatePipe],
    imports: [
        _allModule,
    ],
    exports: [
        _allModule,
        _allComponent,
    ],
    declarations: [
        _allComponent,
    ],

})
export class SharedModule {
}

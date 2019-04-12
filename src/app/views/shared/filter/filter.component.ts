import { Component, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportFilter } from 'src/app/models/reportFilter.model';
import { Enrollment } from '../../../models/enrollment.model';
import { FilterService } from 'src/app/services/filter.service';
import { ToastService } from '../toastmessages';

@Component({
  selector:'report-filter',
  templateUrl: 'filter.component.html',
  providers: [ToastService]
})
export class FilterComponent implements OnInit {
  businessUnits: any[];
  baseLocations: any[];
  focusAreas: any[];
  filterForm: FormGroup;
  allEnrollments: Enrollment[] = [];
  volunteersFreq: any[];
  savedFilters: any[];
  isLoading: boolean = false;
  showSavedFilters: boolean = false;
  showSaveFilter: boolean = false;
  filterName: string;
  @Output() filteredData = new EventEmitter();

  constructor(private filterService: FilterService,  private fb: FormBuilder, private zone: NgZone) { }
  ngOnInit() {
    this.getBusinessUnits();
    this.GetBaseLocations();
    this.GetFocusAreas();
    this.filterForm = this.fb.group({
      businessUnit: [''],
      baseLocation: [''],
      focusArea: [''],
      fromDate: [''],
      toDate: ['']
    });
  }
  getBusinessUnits() {
    this.businessUnits = [];
    this.filterService.getBusinessUnits().subscribe(data => {
      if (data)
        data.forEach(x => this.businessUnits.push({ label: x, value: x }));
    });
  }
  GetBaseLocations() {
    this.baseLocations = [];
    this.filterService.GetBaseLocations().subscribe(data => {
      if (data)
        data.forEach(x => this.baseLocations.push({ label: x, value: x }));
    });
  }
  GetFocusAreas() {
    this.focusAreas = [];
    this.filterService.GetFocusAreas().subscribe(data => {
      if (data)
        data.forEach(x => this.focusAreas.push({ label: x, value: x }));
    });
  }

  getEnrollmentsByFilter() {
    this.isLoading = true;
    let formData: ReportFilter = new ReportFilter();
    let businessUnit = this.filterForm.get('businessUnit').value;
    if (businessUnit && businessUnit != '') 
      formData.businessUnits = businessUnit.join();
    let baseLocation = this.filterForm.get('baseLocation').value;
    if (baseLocation && baseLocation != '')
      formData.baseLocations = baseLocation.join();
    let focusArea = this.filterForm.get('focusArea').value;
    if (focusArea && focusArea != '')
      formData.focusAreas = focusArea.join();
    formData.fromDate = this.filterForm.get('fromDate').value;
    formData.toDate = this.filterForm.get('toDate').value;
    this.filterService.getEnrollmentsByFilter(formData).subscribe(data => {
      this.filteredData.emit(data);
      this.isLoading = false;
    });
   
  }

  onFormReset() {
    this.filterForm.reset();
  }

  onSaveFilter() {
    let formData: ReportFilter = new ReportFilter();
    formData.name = this.filterName;
    let businessUnit = this.filterForm.get('businessUnit').value;
    if (businessUnit)
      formData.businessUnits = businessUnit.join();
    let baseLocation = this.filterForm.get('baseLocation').value;
    if (baseLocation)
      formData.baseLocations = baseLocation.join();
    let focusArea = this.filterForm.get('focusArea').value;
    if (focusArea)
      formData.focusAreas = focusArea.join();
    formData.fromDate = this.filterForm.get('fromDate').value;
    formData.toDate = this.filterForm.get('toDate').value;
    this.filterService.saveFilter(formData).subscribe(data => {
      //this.messageService.success('Success', 'Saved successfully');
      this.filterName = null;
      this.showSaveFilter = false;
    });
  }

  onShowSavedFilters() {
    
    this.filterService.getSavedFilters().subscribe(data => {
      this.savedFilters = data;
      this.showSavedFilters = true;
    });
  }
  onFilter(filterId: number) {
    this.showSavedFilters = false;
    this.isLoading = true;
    this.filterService.getEnrollmentsByFilterId(filterId).subscribe(data => {     
      this.filteredData.emit(data);
      this.isLoading = false;
    });
    
  }

  onCloseFilter() {
    this.filterName = null;
    this.showSaveFilter = false;
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Enrollment } from 'src/app/models/enrollment.model';
import { EngagementService } from 'src/app/services/engagement.service';
import { ReportFilter } from 'src/app/models/reportFilter.model';

@Component({
  templateUrl: 'generic.component.html'
})
export class GenericComponent {
  allEnrollments: Enrollment[] = [];
  filterForm: FormGroup;
  businessUnits: any[];
  baseLocations: any[];
  focusAreas: any[];

  constructor(private engagementService: EngagementService, private fb: FormBuilder) { }

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
    //this.getAllAssociates();
  }

  getBusinessUnits() {
    this.businessUnits = [];
    this.engagementService.getBusinessUnits().subscribe(data => {
      if (data)
        data.forEach(x => this.businessUnits.push({ label: x, value: x }));
    });
  }
  GetBaseLocations() {
    this.baseLocations = [];
    this.engagementService.GetBaseLocations().subscribe(data => {
      if (data)
        data.forEach(x => this.baseLocations.push({ label: x, value: x }));
    });
  }
  GetFocusAreas() {
    this.focusAreas = [];
    this.engagementService.GetFocusAreas().subscribe(data => {
      if (data)
        data.forEach(x => this.focusAreas.push({ label: x, value: x }));
    });
  }

  getEnrollmentsByFilter() {
    let formData: ReportFilter = new ReportFilter();
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
    console.log('form data');
    console.log(formData);
    this.engagementService.getEnrollmentsByFilter(formData).subscribe(data => {
      this.allEnrollments = data;
    });
  }

}

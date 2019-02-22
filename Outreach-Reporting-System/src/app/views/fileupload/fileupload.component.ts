import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getStyle, rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities';

import * as XLSX from 'xlsx';

import { Associate } from '../../models/associate.model';
import { Event } from '../../models/event.model';
import { Enrollment } from '../../models/enrollment.model';
import { FileuploadService } from '../../services/fileupload.service';

//import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../shared/toastmessages';

@Component({
  templateUrl: 'fileupload.component.html',
  providers: [ToastService]
})
export class FileUploadComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private _document: any, private fileuploadService: FileuploadService,
    private messageService: ToastService) { }
  allAssociates: Array<Associate>;
  allEvents: Array<Event>;
  enrollments: Array<Enrollment>;

  showSuccessToast() {
    this.messageService.success('Success', 'Saved successfully');
    this.messageService.info('Information', 'please select');
    this.messageService.warn('Warning', 'dont click');
    this.messageService.error('Error', 'Error occurred');
  }

  public themeColors(): void {
    Array.from(this._document.querySelectorAll('.theme-color')).forEach((el: HTMLElement) => {
      const background = getStyle('background-color', el);
      const table = this._document.createElement('table');
      table.innerHTML = `
        <table class="w-100">
          <tr>
            <td class="text-muted">HEX:</td>
            <td class="font-weight-bold">${rgbToHex(background)}</td>
          </tr>
          <tr>
            <td class="text-muted">RGB:</td>
            <td class="font-weight-bold">${background}</td>
          </tr>
        </table>
      `;
      el.parentNode.appendChild(table);
    });
  }

  ngOnInit(): void {
    this.themeColors();
  }

  clearSelectedFiles() {
    console.log("clear button clicked");
  }
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    console.log('fileselected' + event);
    this.file = event.files[0];
  }

  Upload() {
    this.allAssociates = [];
    this.allEvents = [];
    this.enrollments = [];
    // this.file.forEach(file => {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      let dataContent = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      if (dataContent.length > 0) {
        let rowNumber = 1;
        dataContent.forEach(row => {
          this.validateExcelData(rowNumber, row);
          rowNumber++;
        })
        this.saveExcelDataToDb();
      }
    }
    fileReader.readAsArrayBuffer(this.file);
    //});


  }
  uploadedFiles: any[] = [];
  onUpload(event) {
    this.allAssociates = [];
    this.allEvents = [];
    this.enrollments = [];
    for(let file of event.files) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        let dataContent = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(dataContent);
        if (dataContent.length > 0) {
          let rowNumber = 1;
          dataContent.forEach(row => {
            this.validateExcelData(rowNumber, row);
            rowNumber++;
          })
          this.saveExcelDataToDb();
        }
      }
      fileReader.readAsArrayBuffer(file);
    }
    
}
  saveExcelDataToDb() {
    if (this.allAssociates.length > 0) {
      this.fileuploadService.saveAssociates(this.allAssociates)
        .subscribe(data => {
          this.allAssociates = [];
          console.log(data)
          this.showSuccessToast();
        });
    }
    if (this.allEvents.length > 0) {
      this.fileuploadService.saveEvents(this.allEvents)
        .subscribe(data => {
          this.allEvents = [];
          console.log(data)
          this.showSuccessToast();
        });
    }
    if (this.enrollments.length > 0) {
      this.fileuploadService.saveEnrollments(this.enrollments)
        .subscribe(data => {
          this.enrollments = [];
          console.log(data)
          this.showSuccessToast();
        });
    }
  }

  validateExcelData(rowNumber, rowData) {
    let associateId = rowData["Associate ID"];
    let eventId = rowData["Event ID"];
    let employeeId = rowData["Employee ID"];

    if (!eventId && !employeeId && associateId && /^\d+$/.test(associateId.toString()) && associateId.toString().length == 6)
      this.createAssociateModelFromExcel(rowNumber, rowData);
    if (eventId && !associateId && !employeeId)
      this.createEventModelFromExcel(rowNumber, rowData);
    if (eventId && employeeId && /^\d+$/.test(employeeId.toString()) && employeeId.toString().length == 6)
      this.createEnrollmentModelFromExcel(rowNumber, rowData);
  }

  validateAssociateDataFromExcel(rowNumber, rowData) {
    let id = rowData["Associate ID"];
    if (id && /^\d+$/.test(id.toString()) && id.toString().length == 6)
      this.createAssociateModelFromExcel(rowNumber, rowData);
  }

  createAssociateModelFromExcel(rowNumber, rowData) {
    let associate = new Associate();
    associate.id = rowData["Associate ID"];
    associate.name = rowData["Name"];
    associate.designation = rowData["Designation"];
    associate.location = rowData["Location"];
    associate.BU = rowData["BU"];
    associate.createdBy = 'senthil';
    this.allAssociates.push(associate);
  }

  validateEventDataFromExcel(rowNumber, rowData) {
    let id = rowData["Event ID"];
    if (id)
      this.createEventModelFromExcel(rowNumber, rowData);
  }

  createEventModelFromExcel(rowNumber, rowData) {
    let event = new Event();
    event.id = rowData["Event ID"];
    event.name = rowData["Event Name"];
    event.description = rowData["Event Description"];
    event.date = rowData["Event Date (DD-MM-YY)"];
    event.baseLocation = rowData["Base Location"]
    event.address = rowData["Venue Address"];
    if (event.address) {
      let _address = event.address.split(',');
      if (_address.length > 0) {
        if (_address.length - 4 >= 0)
          event.address = _address[_address.length - 4];
        if (_address.length - 3 > 0)
          event.city = _address[_address.length - 3];
        if (_address.length - 2 > 0)
          event.state = _address[_address.length - 2];
        if (_address.length - 1 > 0) {
          if (_address[_address.length - 1].length > 0) {
            let _pincode = _address[_address.length - 1].split('-');
            if (_pincode.length > 0)
              event.country = _pincode[0];

            if (_pincode.length > 0)
              event.pincode = _pincode[1];
          }
        }
      }
    }
    event.beneficiary = rowData["Beneficiary Name"];
    event.councilName = rowData["Council Name"];
    event.project = rowData["Project"];
    event.category = rowData["Category"];
    event.livesImpacted = rowData["Lives Impacted"];
    event.activityType = rowData["Activity Type"];
    event.status = rowData["Status"];
    this.allEvents.push(event);
  }

  validateEnrollmentDataFromExcel(rowNumber, rowData) {
    let eventId = rowData["Event ID"];
    let associateId = rowData["Employee ID"];
    if (eventId && associateId && /^\d+$/.test(associateId.toString()) && associateId.toString().length == 6)
      this.createEnrollmentModelFromExcel(rowNumber, rowData);
  }

  createEnrollmentModelFromExcel(rowNumber, rowData) {
    let enrollment = new Enrollment();
    enrollment.eventId = rowData["Event ID"];
    enrollment.associateId = rowData["Employee ID"];
    enrollment.volunteerHours = rowData["Volunteer Hours"];
    enrollment.travelHours = rowData["Travel Hours"];
    enrollment.status = rowData["Status"];
    enrollment.iiepCategory = rowData["IIEP Category"];
    this.enrollments.push(enrollment);
  }

}

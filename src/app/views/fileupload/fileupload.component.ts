import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import * as XLSX from 'xlsx';

import { Associate } from '../../models/associate.model';
import { Event } from '../../models/event.model';
import { Enrollment } from '../../models/enrollment.model';
import { FileModel } from '../../models/file.model';
import { FileuploadService } from '../../services/fileupload.service';

//import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../shared/toastmessages';
@Component({
  templateUrl: 'fileupload.component.html',
  providers: [ToastService]
})
export class FileUploadComponent implements OnInit {
  constructor(private fileuploadService: FileuploadService,
    private messageService: ToastService) { }
  associateErrorMsgs = [];
  eventErrorMsgs = [];
  enrollErrorMsgs = [];
  allAssociates: Array<Associate>;
  allEvents: Array<Event>;
  enrollments: Array<Enrollment>;
  fileInformation: FileModel[];
  isIgnoreInalidData: boolean = true;
  sixDigitRegex: any = /^\d+$/;
  decimalRegex: any = /^\d+(\.\d{1,2})?$/;

  showSuccessToast() {
    this.messageService.success('Success', 'Saved successfully');
    this.messageService.info('Information', 'please select');
    this.messageService.warn('Warning', 'dont click');
    this.messageService.error('Error', 'Error occurred');
  }

  ngOnInit(): void {

  }

  clearSelectedFiles() {
  }
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    console.log('fileselected' + event);
    this.file = event.files[0];
  }

  uploadedFiles: any[] = [];
  onUpload(event) {
    this.allAssociates = [];
    this.allEvents = [];
    this.enrollments = [];
    this.associateErrorMsgs = [];
    this.eventErrorMsgs = [];
    this.enrollErrorMsgs = [];
    for (let file of event.files) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.fileInformation = [];
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        let dataContent = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        if (dataContent.length > 0) {
          let rowNumber = 1;
          dataContent.forEach(row => {
            rowNumber++;
            this.validateExcelData(rowNumber, row);
          })
          this.saveExcelDataToDb(file.name);
        }
      }
      fileReader.readAsArrayBuffer(file);
    }
  }

  addFileInfo(fileName: string) {
    this.fileInformation.push({ fileName: fileName, createdBy: 123456 });
  }
  saveExcelDataToDb(fileName: string) {
    if (this.allAssociates.length > 0 && (this.associateErrorMsgs.length == 0 || this.isIgnoreInalidData)) {
      let associateData = this.allAssociates;
      this.allAssociates = [];
      this.fileuploadService.saveAssociates(associateData)
        .subscribe(data => {
          this.messageService.success('Success', 'Saved successfully');
          this.addFileInfo(fileName);//save file details
        });
    }
    if (this.allEvents.length > 0 && (this.eventErrorMsgs.length == 0 || this.isIgnoreInalidData)) {
      let eventData = this.allEvents;
      this.allEvents = [];
      this.fileuploadService.saveEvents(eventData)
        .subscribe(data => {
          this.messageService.success('Success', 'Saved successfully');
          this.addFileInfo(fileName);
        });
    }
    if (this.enrollments.length > 0 && (this.enrollErrorMsgs.length == 0 || this.isIgnoreInalidData)) {
      let enrollData = this.enrollments;
      this.enrollments = [];
      this.fileuploadService.saveEnrollments(enrollData)
        .subscribe(data => {
          this.messageService.success('Success', 'Saved successfully');
          this.addFileInfo(fileName);
        });
    }
  }

  validateExcelData(rowNumber, rowData) {
    let associateId = rowData["Associate ID"];
    let eventId = rowData["Event ID"];
    let employeeId = rowData["Employee ID"];

    if (!eventId && !employeeId && associateId && this.sixDigitRegex.test(associateId.toString()) && associateId.toString().length == 6)
      this.validateAssociateExcel(rowNumber, rowData);

    if (eventId && !associateId && !employeeId)
      this.validateEventDataFromExcel(rowNumber, rowData);

    if (eventId && employeeId && this.sixDigitRegex.test(employeeId.toString()) && employeeId.toString().length == 6)
      this.validateEnrollmentDataFromExcel(rowNumber, rowData);
  }

  validateAssociateDataFromExcel(rowNumber, rowData) {
    let id = rowData["Associate ID"];
    this.validateAssociateExcel(rowNumber, rowData);
    if (id && this.sixDigitRegex.test(id.toString()) && id.toString().length == 6)
      this.createAssociateModelFromExcel(rowNumber, rowData);
  }

  validateAssociateExcel(rowNumber, rowData) {
    //let associate = new Associate();

    let error = [];
    let id = rowData["Associate ID"];
    if (id == undefined || (!this.sixDigitRegex.test(id.toString()) && id.toString().length != 6)) {
      error.push('Invalid associate id');
    }
    let name = rowData["Name"];
    if (name == undefined) {
      error.push('Invalid associate name');
    }
    let designation = rowData["Designation"];
    if (designation == undefined) {
      error.push('Invalid designation');
    }
    let baseLocation = rowData["Location"];
    if (baseLocation == undefined) {
      error.push('Invalid location');
    }
    let businessUnit = rowData["BU"];
    if (businessUnit == undefined) {
      error.push('Invalid business unit');
    }
    let createdBy = 'senthil';
    if (error.length > 0)
      this.associateErrorMsgs.push({ row: rowNumber, errorMsg: error });
    else
      this.createAssociateModelFromExcel(rowNumber, rowData);
    //this.allAssociates.push(associate);
  }

  createAssociateModelFromExcel(rowNumber, rowData) {
    let associate = new Associate();
    associate.id = rowData["Associate ID"];
    associate.name = rowData["Name"];
    associate.designation = rowData["Designation"];
    associate.baseLocation = rowData["Location"];
    associate.businessUnit = rowData["BU"];
    associate.createdBy = 'senthil';
    this.allAssociates.push(associate);
  }

  validateEventDataFromExcel(rowNumber, rowData) {
    let errors = [];
    let id = rowData["Event ID"];
    //if (id)
    //  this.createEventModelFromExcel(rowNumber, rowData);

    if (id == undefined || id.length > 20) {
      errors.push('Invalid event id');
    }
    let name = rowData["Event Name"];
    if (name == undefined) {
      errors.push('Invalid event name');
    }
    let date = rowData["Event Date (DD-MM-YY)"];
    if (!date) {
      errors.push('Invalid event date');
    }
    let baseLocation = rowData["Base Location"]
    if (baseLocation == undefined)
      errors.push('Invalid base location');
    let beneficiary = rowData["Beneficiary Name"];
    if (beneficiary == undefined)
      errors.push('Invalid beneficiary');
    let project = rowData["Project"];
    if (project == undefined)
      errors.push('Invalid project name');
    let category = rowData["Category"];
    if (category == undefined)
      errors.push('Invalid category');
    let totalVolunteers: string = rowData["Total no. of volunteers"];
    if (totalVolunteers == undefined || !this.decimalRegex.test(totalVolunteers))
      errors.push('Invalid total volunteers');
    let totalTravelHours: string = rowData["Total Travel Hours"];
    if (totalTravelHours == undefined || !this.decimalRegex.test(totalTravelHours))
      errors.push('Invalid total travel hours');
    let totalVolunteerHours: string = rowData["Total Volunteer Hours"];
    if (totalVolunteerHours == undefined || !this.decimalRegex.test(totalVolunteerHours))
      errors.push('Invalid total volunteer hours');
    let livesImpacted: string = rowData["Lives Impacted"];
    if (livesImpacted == undefined || !this.decimalRegex.test(livesImpacted))
      errors.push('Invalid lives impacted');
    let activityType = rowData["Activity Type"];
    let status = rowData["Status"];

    if (errors.length > 0)
      this.eventErrorMsgs.push({ row: rowNumber, errorMsg: errors });
    else
      this.createEventModelFromExcel(rowNumber, rowData);
  }

  getValidDateFormat(date: string) {
    let numberArray = date.split("-");
    numberArray[0] = (parseInt(numberArray[0]) + 1).toString();
    numberArray.splice(1, 0, numberArray.splice(0, 1)[0]);
    return new Date(Date.parse(numberArray.join('-'))).toUTCString();
  }

  createEventModelFromExcel(rowNumber, rowData) {
    let event = new Event();
    event.id = rowData["Event ID"];
    event.name = rowData["Event Name"];
    event.description = rowData["Event Description"];
    let date = rowData["Event Date (DD-MM-YY)"];
    if (date) {
      event.date = this.getValidDateFormat(date);
    }
    event.baseLocation = rowData["Base Location"]
    event.address = rowData["Venue Address"];
    event.createdBy = 'senthil';
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

            if (_pincode.length > 1)
              event.pincode = _pincode[1];
          }
        }
      }
    }
    event.beneficiary = rowData["Beneficiary Name"];
    event.councilName = rowData["Council Name"];
    event.project = rowData["Project"];
    event.category = rowData["Category"];
    event.totalVolunteers = rowData["Total no. of volunteers"];
    event.totalTravelHours = rowData["Total Travel Hours"];
    event.totalVolunteerHours = rowData["Total Volunteer Hours"];
    event.livesImpacted = rowData["Lives Impacted"];
    event.activityType = rowData["Activity Type"];
    event.status = rowData["Status"];

    let pocId = rowData["POC ID"];
    let pocName = rowData["POC Name"];
    let pocContact = rowData["POC Contact Number"];
    let pocs = [];
    if (pocId) {

      let ids = [];
      if (isNaN(pocId))
        ids = pocId.split(';');
      else ids.push(pocId);

      let names = pocName.split(';');

      let contacts = [];
      if (isNaN(pocId))
        contacts = pocContact.split(';');
      else contacts.push(pocContact);

      let id;
      let name;
      let contact;
      let i;
      for (i = 0; i < ids.length; i++) {
        id = ids[i];

        if (this.sixDigitRegex.test(id.toString())) {
          if (i < names.length)
            name = names[i];
          else name = '';

          if (i < contacts.length)
            contact = contacts[i];
          else contact = null;

          pocs.push({ id: 0, associateId: id, name: name, contactNumber: contact, createdBy: 0, modifiedBy: 0 });
        }
      }
    }
    event.pointOfContacts = pocs.length > 0 ? pocs : null;
    this.allEvents.push(event);
  }

  validateEnrollmentDataFromExcel(rowNumber, rowData) {
    let errors = [];

    //let eventId = rowData["Event ID"];
    //let associateId = rowData["Employee ID"];
    //if (eventId && associateId && this.sixDigitRegex.test(associateId.toString()) && associateId.toString().length == 6)
    //  this.createEnrollmentModelFromExcel(rowNumber, rowData);

    let eventID = rowData["Event ID"];
    if (eventID == undefined) {
      errors.push('Invalid event id');
    }
    let date = rowData["Event Date (DD-MM-YY)"];
    if (!date) {
      errors.push('Invalid event date');
    }
    let associateID: string = rowData["Employee ID"];
    if (associateID == undefined || (!this.sixDigitRegex.test(associateID) && associateID.length != 6)) {
      errors.push('Invalid employee id');
    }
    let volunteerHours = rowData["Volunteer Hours"];
    if (volunteerHours == undefined || !this.decimalRegex.test(volunteerHours))
      errors.push('Invalid volunteerHours');
    let travelHours = rowData["Travel Hours"];
    if (travelHours == undefined || !this.decimalRegex.test(travelHours))
      errors.push('Invalid travelHours');
    let status = rowData["Status"];
    let iiepCategory = rowData["IIEP Category"];

    if (errors.length > 0)
      this.enrollErrorMsgs.push({ row: rowNumber, errorMsg: errors });
    else
      this.createEnrollmentModelFromExcel(rowNumber, rowData);
  }

  createEnrollmentModelFromExcel(rowNumber, rowData) {
    let enrollment = new Enrollment();
    enrollment.eventID = rowData["Event ID"];
    let date = rowData["Event Date (DD-MM-YY)"];
    if (date) {
      enrollment.eventDate = this.getValidDateFormat(date);
    }
    enrollment.associateID = rowData["Employee ID"];
    enrollment.volunteerHours = rowData["Volunteer Hours"];
    enrollment.travelHours = rowData["Travel Hours"];
    enrollment.status = rowData["Status"];
    enrollment.businessUnit = rowData["Business Unit"];
    enrollment.baseLocation = rowData["Base Location"];
    enrollment.iiepCategory = rowData["IIEP Category"];
    enrollment.createdBy = 'senthil';
    this.enrollments.push(enrollment);
  }

  saveFileInfo() {
    if (this.fileInformation.length > 0) {
      this.fileuploadService.saveFileInfo(this.fileInformation)
        .subscribe(data => {

        });
    }
  }
}

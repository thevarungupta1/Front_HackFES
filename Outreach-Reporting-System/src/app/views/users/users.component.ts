import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getStyle, rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities';

import * as XLSX from 'xlsx';

import { Associate } from '../../models/associate.model';
import { Event } from '../../models/event.model';
import { Enrollment } from '../../models/enrollment.model';
import { UserService } from '../../services/user.service';
import { UserRoles } from '../../models/roles.model';

//import { MessageService } from 'primeng/components/common/messageservice';
import { ToastService } from '../shared/toastmessages';
import { saveAs } from 'file-saver';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { array } from '@amcharts/amcharts4/core';
import { UserModel } from 'src/app/models/user.model';

@Component({
  templateUrl: 'users.component.html',
  //   styles: [`
  //   :host ::ng-deep button {
  //       margin-right: .25em;
  //   }

  //   :host ::ng-deep .custom-toast .ui-toast-message {
  //       color: #ffffff;
  //       background: #FC466B;
  //       background: -webkit-linear-gradient(to right, #3F5EFB, #FC466B);
  //       background: linear-gradient(to right, #3F5EFB, #FC466B);
  //   }

  //   :host ::ng-deep .custom-toast .ui-toast-close-icon {
  //       color: #ffffff;
  //   }
  // `],
  providers: [ToastService]
})
export class UsersComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private _document: any, private userService: UserService,
    private messageService: ToastService, private fb: FormBuilder) { }
  allAssociates: Array<Associate>;
  allEvents: Array<Event>;
  enrollments: Array<Enrollment>;
  roles: Array<UserRoles>;
  showSuccessToast() {
    this.messageService.success('Success', 'Saved successfully');
    this.messageService.info('Information', 'please select');
    this.messageService.warn('Warning', 'dont click');
    this.messageService.error('Error', 'Error occurred');
  }

  userForm: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      associateId: ['', Validators.required],
      email: ['', Validators.required],
      roleId: ['', Validators.required]
    });
    this.getRoles();
  }
  get fc() { return this.userForm.controls; }
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
    for (let file of event.files) {
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
          //let rowNumber = 1;
          // dataContent.forEach(row => {
          //   //this.validateExcelData(rowNumber, row);
          //   rowNumber++;
          // })
          //this.saveExcelDataToDb();
        }
      }
      fileReader.readAsArrayBuffer(file);
    }

  }
  saveExcelDataToDb() {
    if (this.allAssociates.length > 0) {
      this.userService.saveAssociates(this.allAssociates)
        .subscribe(data => {
          console.log(data)
          this.showSuccessToast();
        });
    }
    if (this.allEvents.length > 0) {
      this.userService.saveEvents(this.allEvents)
        .subscribe(data => {
          console.log(data)
          this.showSuccessToast();
        });
    }
    if (this.enrollments.length > 0) {
      this.userService.saveEnrollments(this.enrollments)
        .subscribe(data => {
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
    associate.baseLocation = rowData["Location"];
    associate.businessUnit = rowData["BU"];
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
    enrollment.eventID = rowData["Event ID"];
    enrollment.associateID = rowData["Employee ID"];
    enrollment.volunteerHours = rowData["Volunteer Hours"];
    enrollment.travelHours = rowData["Travel Hours"];
    enrollment.status = rowData["Status"];
    enrollment.iiepCategory = rowData["IIEP Category"];
    this.enrollments.push(enrollment);
  }


  //   downloadExcelTemplate(){
  //     this.userService.downloadExcelTemplate().subscribe(excel =>
  //     {
  // let file: any = new Blob([excel], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
  // saveAs(file,'test.xlsx');   
  // })
  //   }

  onUserSave() {
    let formData: UserModel = new UserModel();
    formData.firstName = this.userForm.get('firstName').value;
    formData.lastName = this.userForm.get('lastName').value;
    formData.email = this.userForm.get('email').value;
    formData.associateId = this.userForm.get('associateId').value;
    formData.roleID = this.userForm.get('roleId').value;
    let postData: UserModel[] = [];
    postData.push(formData);
    this.userService.saveUser(postData)
      .subscribe(data => {
        console.log(data)
        this.showSuccessToast();
      });
  }

  onFormClear() {
    this.userForm.reset();
    console.log('clear button clicked');
  }
  getRoles() {
    this.userService.getRoles()
      .subscribe(data => {
        console.log(data)
        this.roles = data;
      });
  }
}

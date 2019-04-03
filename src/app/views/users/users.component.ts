import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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
import { UserModel } from 'src/app/models/user.model';

@Component({
  templateUrl: 'users.component.html',
  providers: [ToastService]
})
export class UsersComponent implements OnInit {
  constructor(private userService: UserService,
    private messageService: ToastService, private fb: FormBuilder) { }
  userList: Array<UserModel>;
  pocList: Array<UserModel>;
  roles: Array<UserRoles>;
  events: any[];
  showEvents: boolean = false;
  
  userForm: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      associateId: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', Validators.required],
      roleId: ['', Validators.required],
      event: ['']
    });
    this.getRoles();
    this.getEvents();
  }
  get fc() { return this.userForm.controls; }
  clearSelectedFiles() {
  }
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.files[0];
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
        this.userList = [];
        this.pocList = [];
        if (dataContent.length > 0) {

          dataContent.forEach(row => {
            let rowNumber = 1;
            this.createModelFromExcel(rowNumber, row);
            rowNumber++;
          });
          this.saveApplicationUsers(this.userList);
          this.savePocUsers(this.pocList);
        }
      }
      fileReader.readAsArrayBuffer(file);
    }
  }

  createModelFromExcel(rowNumber, rowData) {
    let userModel = new UserModel();
    userModel.associateId = rowData["Associate ID"];
    userModel.firstName = rowData["First Name"];
    userModel.lastName = rowData["Last Name"];
    userModel.email = rowData["Email"];
    let role = rowData["Role(Admin or PMO or POC)"];
    let roleid = 0;
    if (role == 'Admin')
      roleid = 1;
    else if (role == 'PMO')
      roleid = 2;
    else if (role == 'POC')
    roleid = 3;
    userModel.roleID = roleid;
    if (roleid == 3) {
      let eventIds = rowData["Event ID for POC role(seperated by comma if many)"];
      if (eventIds) {
        userModel.eventIds = eventIds;
      }
    }
    if (roleid == 3)
      this.pocList.push(userModel);
    else
    this.userList.push(userModel);
  }

  downloadExcelTemplate() {
    this.userService.downloadExcelTemplate().subscribe(blob => {
      let file: any = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(file, 'ApplicationUsers.xlsx');
    })
  }

  onUserSave() {
    let formData: UserModel = new UserModel();
    formData.firstName = this.userForm.get('firstName').value;
    formData.lastName = this.userForm.get('lastName').value;
    formData.email = this.userForm.get('email').value;
    formData.associateId = this.userForm.get('associateId').value;
    formData.roleID = this.userForm.get('roleId').value;
    if (formData.roleID == 3) {
      let events = this.userForm.get('event').value;
      if (events && events.length > 0) {
        formData.eventIds = events.join();
      }
      let pocData: UserModel[] = [];
      pocData.push(formData);
      this.savePocUsers(pocData);
    }
    else {
      let userData: UserModel[] = [];
      userData.push(formData);
      this.saveApplicationUsers(userData);
    }
  }

  saveApplicationUsers(userList: UserModel[]) {
    if (userList.length == 0)
      return false;
    this.userService.saveUser(userList)
      .subscribe(data => {
        this.messageService.success('Success', 'Saved successfully');
      });
  }

  savePocUsers(pocList: UserModel[]) {
    if (pocList.length == 0)
      return false;
    this.userService.savePOC(pocList)
      .subscribe(data => {
        this.messageService.success('Success', 'Saved successfully');
      });
  }

  onFormClear() {
    this.userForm.reset();
  }
  getRoles() {
    this.userService.getRoles()
      .subscribe(data => {
        this.roles = data;
      });
  }

  getEvents() {
    this.events = [];
    this.userService.getEvents()
      .subscribe(data => {
        if (data)
          data.forEach(x => this.events.push({ label: x.id, value: x.id }));
      });
  }

  roleChanged(data) {
    if (data && data.target.value == 3)
      this.showEvents = true;
    else this.showEvents = false;
  }
}

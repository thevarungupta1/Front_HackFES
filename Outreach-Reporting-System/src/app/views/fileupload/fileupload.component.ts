import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getStyle, rgbToHex } from '@coreui/coreui/dist/js/coreui-utilities';

import * as XLSX from 'xlsx';

import { Associate, Event, Location } from './fileupload.model';
import { FileuploadService } from './fileupload.service';
@Component({
  templateUrl: 'fileupload.component.html'
})
export class FileUploadComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private _document: any, private fileuploadService: FileuploadService) {}
allAssociates: Array<Associate>;
allEvents: Array<Event>;
  
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

  arrayBuffer:any;
file:File;
incomingfile(event) 
  {
    console.log('fileselected'+event);
  this.file= event.files[0]; 
  setTimeout(()=>{ }, 4000);
  }

 Upload() {
      let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            let dataContent = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            if(dataContent.length > 0){
              let rowNumber = 1;
              this.allAssociates = [];
              this.allEvents=[];
              dataContent.forEach(row =>{
                this.validateExcelData(rowNumber, row);
                rowNumber++;
              })
            }
            console.log(this.allAssociates);
            //this.fileuploadService.saveAssociates(this.allAssociates).subscribe(data => console.log(data));
            this.fileuploadService.saveEvents(this.allEvents).subscribe(data => console.log(data));
        }
        fileReader.readAsArrayBuffer(this.file);
       
}

validateExcelData(rowNumber, rowData){
  //this.validateAssociateDataFromExcel(rowNumber, rowData);
  this.validateEventDataFromExcel(rowNumber, rowData);
}

validateAssociateDataFromExcel(rowNumber, rowData){
  let id = rowData["Associate ID"];
if(id && /^\d+$/.test(id.toString()) && id.toString().length == 6)
  this.createAssociateModelFromExcel(rowNumber, rowData);
}

createAssociateModelFromExcel(rowNumber, rowData){
  let associate = new Associate();
  associate.id = rowData["Associate ID"];
  associate.name = rowData["Name"];
  associate.designation = rowData["Designation"];
  associate.location = rowData["Location"];
  associate.BU = rowData["BU"];
  this.allAssociates.push(associate);
}

validateEventDataFromExcel(rowNumber, rowData){
  let id = rowData["Event ID"];
if(id)
  this.createEventModelFromExcel(rowNumber, rowData);
}

createEventModelFromExcel(rowNumber, rowData){
  let event = new Event();
  event.id = rowData["Event ID"];
  event.name = rowData["Event Name"];
  event.description = rowData["Event Description"];
  //event.date = rowData["Event Date (DD-MM-YY)"];
  event.beneficiary = rowData["Beneficiary Name"];
  event.councilName = rowData["Council Name"];
  event.project = rowData["Project"];
  event.category = rowData["Category"];
  event.livesImpacted = rowData["Lives Impacted"];
  event.activityType = rowData["Activity Type"];
  event.status = rowData["Status"];  
  this.allEvents.push(event);
}


}

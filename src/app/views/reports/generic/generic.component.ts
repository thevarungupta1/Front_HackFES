import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Enrollment } from 'src/app/models/enrollment.model';
import { EngagementService } from 'src/app/services/engagement.service';
import { ReportFilter } from 'src/app/models/reportFilter.model';
import { GenericService } from 'src/app/services/generic.service';

@Component({
  templateUrl: 'generic.component.html'
})
export class GenericComponent {
  uniqVolunteers: any[] = [];
  weekday: number = 0;
  fromDate: any;
  toDate: any;
  showReport: boolean = false;
  constructor(private genericService: GenericService) { }

  ngOnInit() {
    //this.getUniqVolunteers();
  }

  getUniqVolunteers() {
    let fromDate = this.fromDate != undefined ? this.fromDate : '';
    let toDate = this.toDate != undefined ? this.toDate : '';
    this.genericService.getUniqVolunteers(fromDate, toDate).subscribe(data => {
      //let resultData = [];
      this.uniqVolunteers = [];
      if (data) {
        let groupedData = this.groupBy(data, function (item) {
          return [item.associateID];
        });
        let volunteerHrs: number = 0;
        let enrollCount: number = 0;
        groupedData.forEach(enroll => {
          volunteerHrs = 0;
          enroll.forEach(associate => {
            volunteerHrs = volunteerHrs + associate.volunteerHours;
          })
          //enroll[0].volunteerHours = volunteerHrs;
          let d = new Date(enroll[0].eventDate);
          if (enroll)
            enrollCount = enroll.length;
          else enrollCount = 0;
          let n = d.getDay();
          if (this.weekday == 1) {
            if (n > 0 && n < 6) {
              this.uniqVolunteers.push({ volunteer: enroll[0].associates, volunteerHrs: volunteerHrs, events: enrollCount });
            }
          } else if (this.weekday == 2) {
            if (n == 0 || n == 6) {
              this.uniqVolunteers.push({ volunteer: enroll[0].associates, volunteerHrs: volunteerHrs, events: enrollCount });
            }
          } else
            this.uniqVolunteers.push({ volunteer: enroll[0].associates, volunteerHrs: volunteerHrs, events: enrollCount });
        });       
      }
      //this.uniqVolunteers = resultData;//this.getUnique(resultData, 'associateID');
      this.showReport = true;
    });

  }
  groupBy(array, f) {
    var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
  }
  
  reset() {
    this.weekday = 0;
    this.fromDate = undefined;
    this.toDate = undefined;
  }
  //getData() {
  //  let d = new Date(event.date);
  //  let n = d.getDay();
  //  if (n == 0 || n == 6) {
  //    total = event.totalVolunteerHours + event.totalTravelHours;
  //    weekendHours = weekendHours + total;
  //    weekendCount++;
  //  } else {
  //    total = event.totalVolunteerHours + event.totalTravelHours;
  //    weekdayHours = weekdayHours + total;
  //    weekdayCount++;
  //  }

  //  let filteredData: Enrollment[] = [];
  //  if (this.fromDate) {
  //    filteredData = this.allEnrollments.filter(x => x.eventDate >= this.fromDate);
  //  }
  //  if (this.toDate) {
  //    filteredData = this.allEnrollments.filter(x => x.eventDate <= this.toDate);
  //  }


  //  if (this.weekday) {
  //    if (!filteredData)
  //      filteredData
  //    let d = new Date(event.date);
  //    let n = d.getDay();
  //    if (n == 0 || n == 6) {
  //      total = event.totalVolunteerHours + event.totalTravelHours;
  //      weekendHours = weekendHours + total;
  //      weekendCount++;
  //    }
  //  }
  //  else if (this.weekend) {

  //  }
  //  allEnrollments.forEach(enrollment => {
  //    let found = newVolunteers.find(f => f.associateID == enrollment.associateID);
  //    if (!found)
  //      newVolunteers.push(enrollment);
  //  });
  //}

  //getReportData() {

  //  this.generic.GetAllNewVolunteers().subscribe(data => {
  //    let enrolments: Enrollment[] = [];
  //    data.forEach(enrollment => {
  //      let found = newVolunteers.find(f => f.associateID == enrollment.associateID);
  //      if (!found)
  //        newVolunteers.push(enrollment);
  //    });

  //    let currentYearData = newVolunteers.filter(f => new Date(f.eventDate).getFullYear() == this.selectedYear);
  //    let currentYearAllData = data.filter(f => new Date(f.eventDate).getFullYear() == this.selectedYear);

  //    let prevMonthData: Enrollment[] = [];
  //    if (this.selectedMonth > 0) {
  //      let prevMonth = this.selectedMonth - 1;
  //      prevMonthData = currentYearAllData.filter(f => new Date(f.eventDate).getMonth() == prevMonth);
  //    }
  //    else {
  //      let prevMonth = 11;
  //      let prevYear = this.selectedYear - 1;
  //      prevMonthData = data.filter(f => new Date(f.eventDate).getFullYear() == prevYear && new Date(f.eventDate).getMonth() == prevMonth);
  //    }
  //    let selectedMonthData: Enrollment[] = currentYearAllData.filter(f => new Date(f.eventDate).getMonth() == this.selectedMonth);

  //    let consecutiveCount = 0;
  //    selectedMonthData.forEach(data => {
  //      let exist = prevMonthData.find(x => x.associateID == data.associateID);
  //      if (exist)
  //        consecutiveCount++;
  //    });
  //  }
  //  }

}

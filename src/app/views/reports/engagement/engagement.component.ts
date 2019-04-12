import { Component, Input, ViewEncapsulation, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

import { EngagementService } from '../../../services/engagement.service';
import { Enrollment } from '../../../models/enrollment.model';
import { Associate } from '../../../models/associate.model';
import { OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  templateUrl: 'engagement.component.html',
  styles: ['.pager li.btn:active { box-shadow: none; }'],
  encapsulation: ViewEncapsulation.None
})
export class EngagementComponent implements OnInit { 
  showReport: boolean = false;
  allEnrollments: Enrollment[] = [];
  allVolunteers: any[] = [];
  allAssociates: Associate[] = [];
volunteersFreq: any[];
totalVolunteers: number;
public innerWidth: any;
 
  constructor() { }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
  }


  //getAllAssociates() {
  //  this.engagementService.getAllAssociates().subscribe(data => {
  //    this.allAssociates = data;
  //    this.getAllEnrollments();
  //  });
  //}

  //getAllEnrollments() {
  //  this.engagementService.getAllEnrollments().subscribe(data => {
  //    this.allEnrollments = data;
  //    this.joinRecords();
  //  });
  //}
  
  //joinRecords(){
  //  this.allVolunteers =[];
  //this.allEnrollments.map((enrollment)=>{
  //  let associate = this.allAssociates.find((en)=> enrollment.associateID === en.id);
  //  if(associate)
  //  this.allVolunteers.push(Object.assign(enrollment, associate));
  // });
  // this.groupVolunteers();
  // this.pieChart('volunteersFreqChart');
  //}

  groupBy(array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      })
  }

  groupVolunteers() {
    if (this.allEnrollments) {
      let groupedData = [];
      groupedData = this.groupBy(this.allEnrollments, function (item) {
        return [item.associateID];
      });
      this.volunteersFreq = [];
      let oneTime = 0;
      let twoToFiveTimes = 0;
    let fivePlusTimes = 0;
      if (groupedData) {

        groupedData.forEach(v => {
          if (v) {
            if (v.length == 1)//one time
              oneTime++;
            else if (v.length > 5)//five plus time
              fivePlusTimes++;
            else //two to five time
              twoToFiveTimes++;
          }
        });
      }
      let totalVolunteers = this.allEnrollments ? this.allEnrollments.length:0;
      this.volunteersFreq.push({ 'frequency': 'One Time Volunteers', 'countinpercent': oneTime / totalVolunteers });
      this.volunteersFreq.push({ 'frequency': 'Two To Five Time Volunteers', 'countinpercent': twoToFiveTimes / totalVolunteers });
      this.volunteersFreq.push({ 'frequency': 'Five Plus Time Volunteers', 'countinpercent': fivePlusTimes / totalVolunteers });
    }
  }

  pieChart(chartcontainer: string) {
    //this.zone.runOutsideAngular(() => {
      let chart = am4core.create(chartcontainer, am4charts.PieChart);

      // Enable export
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.filePrefix = chartcontainer;

      //enable responsive
      chart.responsive.enabled = true;
      chart.responsive.useDefault = false
      chart.responsive.enabled = true;

      chart.responsive.rules.push({
        relevant: function (target) {
          if (target.pixelWidth <= 400) { return true; }
          return false;
        },
        state: function (target, stateId) {
          if (target instanceof am4charts.Chart) {
            var state = target.states.create(stateId);
            state.properties.paddingTop = 5;
            state.properties.paddingRight = 15;
            state.properties.paddingBottom = 5;
            state.properties.paddingLeft = 0;
            return state;
          }
          return null;
        }
      });

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      if (this.innerWidth >= 1200) {
        //legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
      }
      else if (this.innerWidth < 900) {
        //legend
        chart.legend = new am4charts.Legend();
        if (this.innerWidth <= 600)
          chart.legend.position = "bottom";
        //remove label
        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.labels.template.radius = am4core.percent(-40);
        pieSeries.labels.template.fill = am4core.color("white");
      }
      //chart.dataSource.url = "pie_chart_data.json";

      //data source
      chart.data = this.volunteersFreq;

      pieSeries.dataFields.value = "countinpercent";
      pieSeries.dataFields.category = "frequency";
   // });
  }

  onDataFiltered(data) {
    this.showReport = true;
    setTimeout(() => {
      this.allEnrollments = data;
      this.groupVolunteers();
      this.pieChart('volunteersFreqChart');
    }, 1);
     
  }
}

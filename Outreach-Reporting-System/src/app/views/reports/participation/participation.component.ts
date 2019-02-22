import { Component, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { OnInit } from '@angular/core';
import { ParticipationService } from '../../../services/participation.service';

am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'participation.component.html'
})
export class ParticipationComponent implements OnInit {

  private chart: am4charts.XYChart;
  allAssociates: any[] = [];
  allEnrollments: any[] = [];
  headCount: number;
  uniqueVolunteers: number;
  totalVolunteeringHours: number;
  coverage: number;
  totalVolunteers: number;
  averageFreqVolunteer: number;
  avgHourAssociate: number;
  avgHourVolunteer: number;
  totalEvents: number;
  avgHoursPerEventWeekday: number;
  avgHoursPerEventWeekend: number;
  avgVolunteersEvent: number;
  avgHourVolunteerEvent: number; 

  constructor(private zone: NgZone, private participationService: ParticipationService) { }

  ngOnInit(): void {
    this.getAllAssociates();
    this.getAllEnrollments();
  }

  getAllAssociates() {
    this.participationService.getAllAssociates().subscribe(data => this.allAssociates = data);
  }
  getAllEnrollments() {
    this.participationService.getAllEnrollments().subscribe(data => {
      this.allEnrollments = data;
      console.log(data);
      this.metricCalculate();
      //this.pieChart();
    });
  }

  metricCalculate() {
    this.headCount = this.allAssociates.length;

    let eventGroup = this.groupBy(this.allEnrollments, function (item) {
      return [item.eventID];
    });
    let associateGroup = [];
    associateGroup = this.groupBy(this.allEnrollments, function (item) {
      return [item.associateID];
    });
    let result = [];
    // gruped.forEach(x=>
    // {
    //   let totalVolunteers = x.reduce(this.getSum);
    //   result.push({'eventID':x[0].eventID, 'volunteerHours': totalVolunteers});
    // });
    console.log(eventGroup);
    console.log(associateGroup);

    this.uniqueVolunteers = associateGroup.length;
      this.coverage = this.uniqueVolunteers / this.headCount;
      let total: number = 0;
      let totalVolunteers: number = 0;

      eventGroup.forEach(event => {
        event.forEach(associate => {
          total = total + parseInt(associate.travelHours) + parseInt(associate.volunteerHours);
        });
      });

      associateGroup.forEach(associate => {
        totalVolunteers = totalVolunteers + associate.length;
      });
      this.totalVolunteers = totalVolunteers;
      this.averageFreqVolunteer = this.uniqueVolunteers / totalVolunteers;
      this.totalVolunteeringHours = total > 0 ? total : undefined;

      this.avgHourAssociate = Math.floor(this.totalVolunteeringHours / this.headCount);
      this.avgHourVolunteer = Math.floor(this.totalVolunteeringHours / this.totalVolunteers);
      this.totalEvents = eventGroup.length;

      let weekdayHours = 0;
      let weekendHours = 0;
      let weekdayCount = 0;
      let weekendCount = 0;

      let avgVolunteeredHours = 0;
      eventGroup.forEach(event => {
        let total1 = 0;
        let volunteersCount = 0;
        event.forEach(associate => {
          total1 = total1 + parseInt(associate.travelHours) + parseInt(associate.volunteerHours);
          volunteersCount++;
        });
        let avgHour = total1 / volunteersCount;
        avgVolunteeredHours = avgVolunteeredHours + avgHour;
        let d = new Date(event.date);       
        let n = d.getDay();
        if(n == 0 || n == 6){
          weekendHours = weekendHours + total1;
          weekendCount++;
        }else{
          weekdayHours = weekdayHours + total1;
          weekdayCount++;
        }
      });
this.avgHoursPerEventWeekday = weekdayHours / weekdayCount;
this.avgHoursPerEventWeekend = weekendHours / weekendCount;

this.avgVolunteersEvent = this.totalVolunteers / eventGroup.length;

this.avgHourVolunteerEvent = Math.floor(avgVolunteeredHours/ eventGroup.length);
  }

  getUniqueVolunteers() {

  }

  ngAfterViewInit() {
    //this.pieChart();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
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
    })
  }
  getSum(total, arr) {
    let prev: number = isNaN(total.volunteerHours) ? 0 : total.volunteerHours;
    let cur: number = isNaN(arr.volunteerHours) ? 0 : arr.volunteerHours;
    return prev + cur;
  }

  pieChart() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.PieChart);

      let gruped = this.groupBy(this.allEnrollments, function (item) {
        return [item.eventID];
      });
      let result = [];
      gruped.forEach(x => {
        let totalVolunteers = x.reduce(this.getSum);
        result.push({ 'eventID': x[0].eventID, 'volunteerHours': totalVolunteers });
      })
      //let gruped = this.groupBy1(this.allEnrollments, 'bu')
      console.log(gruped);
      console.log(result);
      chart.data = result;
      let test = [{
        "businessUnit": "Health Care",
        "volunteers": 500
      }, {
        "businessUnit": "Banking",
        "volunteers": 301
      }, {
        "businessUnit": "Insurance",
        "volunteers": 201
      }, {
        "businessUnit": "Life Science",
        "volunteers": 165
      }, {
        "businessUnit": "Logistics",
        "volunteers": 139
      }, {
        "businessUnit": "Life Style",
        "volunteers": 128
      }, {
        "businessUnit": "Manufacture",
        "volunteers": 99
      }];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "volunteerHours";
      pieSeries.dataFields.category = "eventID";
      //chart.dataSource.url = "pie_chart_data.json";
    });
  }

  xyChart() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });
  }
}

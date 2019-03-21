import {Component, OnDestroy, NgZone, OnInit} from '@angular/core';

import { AcquisitionService } from 'src/app/services/acquisition.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'acquisition.component.html'
})
export class AcquisitionComponent implements OnInit {


  constructor(private zone: NgZone, private acquisitionService: AcquisitionService) { }
  month = [];
  monthlyNewVolunteers = [];
  currentYear: number = new Date().getFullYear();
  ngOnInit(): void {
   
    this.month[0] = "January";
    this.month[1] = "February";
    this.month[2] = "March";
    this.month[3] = "April";
    this.month[4] = "May";
    this.month[5] = "June";
    this.month[6] = "July";
    this.month[7] = "August";
    this.month[8] = "September";
    this.month[9] = "October";
    this.month[10] = "November";
    this.month[11] = "December";

    this.getAllNewVolunteers();
  }
  
  getAllNewVolunteers() {
    this.acquisitionService.GetAllNewVolunteers().subscribe(data => {

      console.log('GetAllNewVolunteers');
      console.log(data);

      let currentYearData = data.filter(f => new Date(f.eventDate).getFullYear() == this.currentYear);

      var i;
      let monthData=[];
      for (i = 0; i < 12; i++) {
        monthData = currentYearData.filter(f => new Date(f.eventDate).getMonth() == i);
        this.monthlyNewVolunteers.push({ month: this.month[i], volunteers: monthData.length });
      }
      this.monthlyNewVolunteersChart();
      //this.allNewVolunteers = groupedData;
      console.log('monthlyNewVolunteersChart');
      console.log(this.monthlyNewVolunteers);

      ////this.lineGraph();
      //this.getDateWiseVolunteers();
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

  monthlyNewVolunteersChart() {

    // Create chart instance
    let chart = am4core.create("NewVolunteersChart", am4charts.XYChart3D);

    // Add data
    chart.data = this.monthlyNewVolunteers;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "New Volunteers";
    valueAxis.title.fontWeight = "bold";

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "volunteers";
    series.dataFields.categoryX = "month";
    series.name = "New Volunteers";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

  }
}

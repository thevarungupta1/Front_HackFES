import {Component, OnDestroy, NgZone, OnInit} from '@angular/core';

import { AcquisitionService } from 'src/app/services/acquisition.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Enrollment } from 'src/app/models/enrollment.model';
am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'acquisition.component.html'
})
export class AcquisitionComponent implements OnInit {


  constructor(private acquisitionService: AcquisitionService) { }
  months = [];
  monthlyNewVolunteers = [];
  currentYear: number;
  years: string[] = [];
  selectedYear: number;
  selectedMonth: number;
  showReport: boolean;
  avgConsecutiveCount: number;

  ngOnInit(): void {
    this.months = [];
    this.months.push({id:0, month:"January"})
    this.months.push({ id: 1, month:"February"})
    this.months.push({ id: 2, month:"March"})
    this.months.push({ id: 3, month:"April"})
    this.months.push({ id: 4, month:"May"})
    this.months.push({ id: 5, month:"June"})
    this.months.push({ id: 6, month:"July"})
    this.months.push({ id: 7, month:"August"})
    this.months.push({ id: 8, month:"September"})
    this.months.push({ id: 9, month:"October"})
    this.months.push({ id: 10, month:"November"})
    this.months.push({ id: 11, month:"December"})
    this.years = [];
    this.currentYear = new Date().getFullYear();
    let i;
    for (i = this.currentYear; i >= 1990; i--) {
      this.years.push(i);
    }
  }

  getData() {
    this.showReport = true;
    this.getAllNewVolunteers();

  }

  getAllNewVolunteers() {
    this.acquisitionService.GetAllNewVolunteers().subscribe(data => {
      if (data) {
        let newVolunteers: Enrollment[] = [];
        data.forEach(enrollment => {
          let found = newVolunteers.find(f => f.associateID == enrollment.associateID);
          if (!found)
            newVolunteers.push(enrollment);
        });

        let currentYearData = newVolunteers.filter(f => new Date(f.eventDate).getFullYear() == this.selectedYear);
        let currentYearAllData = data.filter(f => new Date(f.eventDate).getFullYear() == this.selectedYear);

        let prevMonthData: Enrollment[] = [];
        if (this.selectedMonth > 0) {
          let prevMonth = this.selectedMonth - 1;
          prevMonthData = currentYearAllData.filter(f => new Date(f.eventDate).getMonth() == prevMonth);
        }
        else {
          let prevMonth = 11;
          let prevYear = this.selectedYear - 1;
          prevMonthData = data.filter(f => new Date(f.eventDate).getFullYear() == prevYear && new Date(f.eventDate).getMonth() == prevMonth);
        }
        let selectedMonthData: Enrollment[] = currentYearAllData.filter(f => new Date(f.eventDate).getMonth() == this.selectedMonth);

        let consecutiveCount = 0;
        selectedMonthData.forEach(data => {
          let exist = prevMonthData.find(x => x.associateID == data.associateID);
          if (exist)
            consecutiveCount++;
        });
        let selectedMonthLength = selectedMonthData?selectedMonthData.length:0;
        this.avgConsecutiveCount = Math.round((consecutiveCount / selectedMonthLength ) * 100) / 100;
        var i;
        let monthData = [];
        for (i = 0; i < 12; i++) {
          monthData = currentYearData.filter(f => new Date(f.eventDate).getMonth() == i);
          this.monthlyNewVolunteers.push({ month: this.months[i].month, volunteers: monthData ? monthData.length:0 });
        }
        this.monthlyNewVolunteersChart();
        ////this.lineGraph();
        //this.getDateWiseVolunteers();
      }
    });

  }

  monthlyNewVolunteersChart() {
    // Create chart instance
    let chart = am4core.create("NewVolunteersChart", am4charts.XYChart3D);

    // Add data
    chart.data = this.monthlyNewVolunteers;

    //enable responsive
    chart.responsive.enabled = true;
    chart.responsive.useDefault = false
    chart.responsive.enabled = true;

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
    series.tooltipText = "New Volunteers: [bold]{valueY}[/]";
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

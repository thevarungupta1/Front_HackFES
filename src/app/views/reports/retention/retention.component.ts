import {Component, SecurityContext, NgZone, OnInit, HostListener} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilter } from 'src/app/models/reportFilter.model';
import { EngagementService } from 'src/app/services/engagement.service';
import { Enrollment } from 'src/app/models/enrollment.model';

am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'retention.component.html'
})
export class RetentionComponent implements OnInit {

  allEnrollments: Enrollment[] = [];
  filterForm: FormGroup;
  showReport: boolean = false;
  public innerWidth: any;
  constructor(private engagementService: EngagementService, private fb: FormBuilder) {
    //this.html = sanitizer.sanitize(SecurityContext.HTML, this.html);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    //this.getAllAssociates();
  }

  onDataFiltered(data) {
    this.showReport = true;
    setTimeout(() => {
      this.allEnrollments = data;
      this.columnChart3d('BuWiseReport');
      this.columnChart3d('LocationWiseReport');
    }, 1);

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

  buWiseVolunteers(): any[] {
    let chartData = [];
    if (this.allEnrollments) {
      let groupedData = this.groupBy(this.allEnrollments, function (item) {
        return [item.businessUnit];
      });


      let currentDate = new Date();
      let enroll: Enrollment;
      let daysDiff = 0;

      groupedData.forEach(enrollment => {
        enroll = enrollment[0];
        enrollment.forEach((e: Enrollment) => {

          if (enroll.eventDate < e.eventDate) {
            enroll = e;
          }
        });

        var startDate = Date.parse(enroll.eventDate);
        var endDate = Date.parse(currentDate.toString());
        var timeDiff = endDate - startDate;
        daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        chartData.push({ businessUnit: enrollment[0].businessUnit, sinceLastEvent: daysDiff });

      });
    }
    return chartData;
  }

  locationWiseVolunteers() {

    let chartData = [];
    if (this.allEnrollments) {
      let groupedData = this.groupBy(this.allEnrollments, function (item) {
        return [item.baseLocation];
      });


      let currentDate = new Date();
      let enroll: Enrollment;
      let daysDiff = 0;

      groupedData.forEach(enrollment => {
        enroll = enrollment[0];
        enrollment.forEach((e: Enrollment) => {

          if (enroll.eventDate < e.eventDate) {
            enroll = e;
          }
        });

        var startDate = Date.parse(enroll.eventDate);
        var endDate = Date.parse(currentDate.toString());
        var timeDiff = endDate - startDate;
        daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        chartData.push({ baseLocation: enrollment[0].baseLocation, sinceLastEvent: daysDiff });

      });
    }
    return chartData;
  }

  columnChart3d(chartContainer: string) {

    // Create chart instance
    let chart = am4core.create(chartContainer, am4charts.XYChart3D);

    //data source
    if (chartContainer == 'BuWiseReport') 
    chart.data = this.buWiseVolunteers();
    else if (chartContainer == 'LocationWiseReport')
      chart.data = this.locationWiseVolunteers();

    let category: string;
    let titleText: string;
    let valueY: string;
    let seriesName: string;

    if (chartContainer == 'BuWiseReport') {
      category = "businessUnit";
      titleText = "Business Unit";
      valueY = "sinceLastEvent";
      seriesName = "sinceLastEvent";
    }
    else if (chartContainer == 'LocationWiseReport') {
      category = "baseLocation";
      titleText = "Base Location";
      valueY = "sinceLastEvent";
      seriesName = "sinceLastEvent";
    }

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";



    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = titleText;
    valueAxis.title.fontWeight = "bold";

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = chartContainer;

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
    }

    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = category;
    series.name = seriesName;
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

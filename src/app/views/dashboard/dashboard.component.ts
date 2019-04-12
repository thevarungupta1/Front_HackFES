import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from "../../services/dashboard.service";
import { Associate } from '../../models/associate.model';
import { Enrollment } from '../../models/enrollment.model';
import { Event } from '../../models/event.model';
import { NgZone } from '@angular/core';


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  private chart: am4charts.XYChart;
  public innerWidth: any;

  allAssociates: Associate[] = [];
  allEvents: Event[] = [];
  allEnrollments: Enrollment[] = [];
  allVolunteers: any[] = [];
  allUniqueVolunteers: Associate[] = [];
  topVolunteers: any[];
  totalAssociates: number;
  totalVolunteers: number;
  totalEvents: number;
  top10Volunteers: Associate[];
  yearlyNewRepeatVolunteers: any[];
  eventGridData: Event[];
  totalVolunteerHours: number;
  topData: any[];
  allNewVolunteers = [];
  dateWiseVolunteers = [];
  recentEvents: Event[];
  showAssociatesModal: boolean = false;
  showVolunteersModal: boolean = false;
  showEventsModal: boolean = false;
  associateColumns: any[];
  volunteerColumns: any[];
  eventColumns: any[];
  volunteersData: any[];

  constructor(private zone: NgZone, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getAllAssociates();
    this.getAllEnrollments();
    this.getDateWiseVolunteers();   
    this.getTopData();
    this.getTopVolunteers();
    this.getRecentEvents();
   // this.getYearlyVolunteers();
    //this.getYearlyBuVolunteers();
  
  }

  getUnique(arr, comp) {

    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

    return unique;
  }

  filterAssociatesFromEnrollments() {
    if (this.allEnrollments) {
      this.allVolunteers = this.allEnrollments.map(m => m.associates);
      if (this.allVolunteers)
        this.allUniqueVolunteers = this.getUnique(this.allVolunteers, 'id');
      if (this.allEnrollments)
      this.allEvents = this.getUnique(this.allEnrollments.map(m => m.events), 'id');
      this.totalEvents = this.allEvents ? this.allEvents.length: 0;
      this.totalVolunteers = this.allUniqueVolunteers ? this.allUniqueVolunteers.length:0;
      this.totalVolunteerHours = 0;
      if (this.allEvents) {
        this.allEvents.forEach(x => {
          this.totalVolunteerHours = this.totalVolunteerHours + x.totalVolunteerHours;
        });
      }
    }
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
      });
  }

  getAllAssociates() {
    this.dashboardService.getAllAssociates().subscribe(data => {
      if (data) {
        this.allAssociates = data;
        this.totalAssociates = data.length;
      }
    });
  }
  //getAllEvents() {
  //  this.dashboardService.getAllEvents().subscribe(data => {
  //    this.allEvents = data;
  //    this.totalEvents = data.length;

  //  });
  //}

  getAllEnrollments() {
    this.dashboardService.getAllEnrollments().subscribe(data => {
      if (data) {
        this.allEnrollments = data;
        this.filterAssociatesFromEnrollments();
      }
    });
  }
  //getAllVolunteers() {
  //  this.allVolunteers = this.allEnrollments.map(e => e.associates);
  //}

  getTopVolunteers() {
    this.topVolunteers = [];
    this.dashboardService.getTopVolunteers(10).subscribe(data => {
      if (data) {
        //let associates = data.map(e => e.associates);
        let groupedData = this.groupBy(data, function (item) {
          return [item.id];
        });
        if (groupedData)
        groupedData.forEach(g => this.topVolunteers.push({ associate: g[0], count: g?g.length:0 }));
      }
    });
  }

  getRecentEvents() {
    this.dashboardService.getAllEvents().subscribe(data => {
      if (data) {
        this.recentEvents = data;
      }
    });
  }

  getEventData(){
    this.dashboardService.getAllEvents().subscribe(data => {
      //data.forEach(element => {
      //  let value = element.date.split('T');
      //  let value2 = value[0].split('-');
      //  element.date = value2[2] + '-' + value2[1] + '-' + value2[0];
      //});
      this.eventGridData = data;
    });    
  }

  getDateWiseVolunteersCount() {
    this.topVolunteers = [];
    this.dashboardService.getTopVolunteers(5).subscribe(data => {
      if (data) {
        let groupedData = this.groupBy(data, function (item) {
          return [item.id];
        });
        if (groupedData)
        groupedData.forEach(g => this.topVolunteers.push({ associate: g[0], count: g?g.length:0 }));
      }
    });
  }

  getTopData() {
    this.dashboardService.GetTopData().subscribe(data => {
      if (data) {
        this.topData = [];
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            this.topData.push({ key: key, count: data[key][0], percent: data[key][1] });
          }
        }
      }
    });

  }

  getDateWiseVolunteers() {
    this.dashboardService.GetDateWiseVolunteers().subscribe(data => {
      if (data) {
        let chartData = [];
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            let date = new Date(key);
            // date = date.setDate(date.getDate() + 1)
            this.dateWiseVolunteers.push({ date: date, new: data[key][0], recur: data[key][1] });
          }
        }
        this.lineGraph(this.dateWiseVolunteers);
        this.doubleLineChart();
      }
    });
    
  }

  rangeAreaChart(){
    
let chart = am4core.create("columnChart", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = this.dateWiseVolunteers;

let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.tooltip.disabled = true;

let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.dateX = "date";
series.dataFields.openValueY = "new";
series.dataFields.valueY = "recur";
series.tooltipText = "new volunteers: {openValueY.value} repeat volunteers: {valueY.value}";
series.sequencedInterpolation = true;
series.fillOpacity = 0.3;
series.defaultState.transitionDuration = 1000;
series.tensionX = 0.8;

let series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.dateX = "date";
series2.dataFields.valueY = "new";
series2.sequencedInterpolation = true;
series2.defaultState.transitionDuration = 1500;
series2.stroke = chart.colors.getIndex(6);
series2.tensionX = 0.8;

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;
chart.scrollbarX = new am4core.Scrollbar();

  }

  lineChart() {

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;

    let data = [];
    let volunteers = 0;
    let previousValue;
    let i = 0
    if (this.dateWiseVolunteers) {
      this.dateWiseVolunteers.forEach(v => {
        volunteers = v.new + v.recur;

        if (i > 0) {
          // add color to previous data item depending on whether current value is less or more than previous value
          if (previousValue <= volunteers) {
            data[i - 1].color = chart.colors.getIndex(0);
          }
          else {
            data[i - 1].color = chart.colors.getIndex(5);
          }
        }
        i++;
        data.push({ date: v.date, volunteers: volunteers })
        previousValue = volunteers;
      });
    }
    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "volunteers";
    series.strokeWidth = 2;
    series.tooltipText = "Volunteers: {valueY}";
    series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";

    // set stroke property field
    series.propertyFields.stroke = "color";

    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX = scrollbarX;

    //chart.events.on("ready", function (ev) {
    //  dateAxis.zoomToDates(
    //    chart.data[50].date,
    //    chart.data[80].date
    //  );
    //});

  }
  dateBasedChart() {

    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);


    let data = [];
    let volunteers = 0;
    let previousValue;
    let i = 0
    if (this.dateWiseVolunteers) {
      this.dateWiseVolunteers.forEach(v => {
        volunteers = v.new + v.recur;

        if (i > 0) {
          // add color to previous data item depending on whether current value is less or more than previous value
          if (previousValue <= volunteers) {
            data[i - 1].color = chart.colors.getIndex(0);
          }
          else {
            data[i - 1].color = chart.colors.getIndex(5);
          }
        }
        i++;
        data.push({ date: v.date, volunteers: volunteers })
        previousValue = volunteers;
      });
    }
    chart.data = data;

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "volunteers";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    //chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    //chart.events.on("ready", function () {
    //  dateAxis.zoom({ start: 0.79, end: 1 });
    //});
  }

  doubleLineChart() {

    // Create chart instance
    let chart = am4core.create("doubleLineChart", am4charts.XYChart);

    // Increase contrast by taking evey second color
    chart.colors.step = 2;

    // Add data
    chart.data = this.dateWiseVolunteers;

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "New Vs Repeat volunteers graph";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    
    this.createAxisAndSeries(chart, "new", "New Volunteers", false, "circle");
    this.createAxisAndSeries(chart, "recur", "Repeated Volunteers", true, "triangle");
    //createAxisAndSeries("hits", "Hits", true, "rectangle");

    // Add legend
    chart.legend = new am4charts.Legend();

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

  }
  // Create series
    createAxisAndSeries(chart, field, name, opposite, bullets) {
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tensionX = 0.8;

  let interfaceColors = new am4core.InterfaceColorSet();
      let bullet;
      if (bullet == "triangle") {
        bullet = series.bullets.push(new am4charts.Bullet());
        bullet.width = 12;
        bullet.height = 12;
        bullet.horizontalCenter = "middle";
        bullet.verticalCenter = "middle";

        let triangle = bullet.createChild(am4core.Triangle);
        triangle.stroke = interfaceColors.getFor("background");
        triangle.strokeWidth = 2;
        triangle.direction = "top";
        triangle.width = 12;
        triangle.height = 12;
      }
      else {
        bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = interfaceColors.getFor("background");
        bullet.circle.strokeWidth = 2;
      }

  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;
  }
  
  lineGraph(chartData) {

    // Create chart instance
    let chart = am4core.create("volunteersGraph", am4charts.XYChart);

    // Add data
    chart.data = chartData.reverse();

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "New volunteers graph";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "new";
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12)

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    //chart.scrollbarX.series.push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
  }

  // Create series
  createSeries(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "year";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueX}";
    valueLabel.label.horizontalCenter = "left";
    valueLabel.label.dx = 10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;

    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
    categoryLabel.label.text = "{name}";
    categoryLabel.label.horizontalCenter = "right";
    categoryLabel.label.dx = -10;
    categoryLabel.label.fill = am4core.color("#fff");
    categoryLabel.label.hideOversized = false;
    categoryLabel.label.truncate = false;
  }

  showAssociateModal() {
    this.associateColumns = [
      { field: 'id', header: 'Associate Id' },
      { field: 'name', header: 'Name' },
      { field: 'designation', header: 'Designation' },
      { field: 'baseLocation', header: 'Base Location' },
      { field: 'businessUnit', header: 'Business Unit' }
    ];
    this.showAssociatesModal = true;
  }

  showVolunteerModal() {
    this.volunteerColumns = [
      { field: 'id', header: 'Associate Id' },
      { field: 'name', header: 'Name' },
      { field: 'designation', header: 'Designation' },
      { field: 'baseLocation', header: 'Base Location' },
      { field: 'businessUnit', header: 'Business Unit' },
      { field: 'events', header: 'Volunteered Events' },
      { field: 'volunteerHrs', header: 'Volunteered Hrs' }
    ];
   
    if (this.allEnrollments) {
      let groupedData = this.groupBy(this.allEnrollments, function (item) {
        return [item.associateID];
      });
      let hrs: number = 0;
      this.volunteersData = [];
      let associate
      if (groupedData) {
        groupedData.forEach(g => {
          hrs = 0;
          g.forEach(h => hrs = hrs + h.volunteerHours);
          associate = g[0].associates;
          this.volunteersData.push({
            id: associate.id, name: associate.name, designation: associate.designation, baseLocation: associate.baseLocation,
            businessUnit: associate.businessUnit, events: g.length, volunteerHrs: hrs
          });
        });
      }
      }

    this.showVolunteersModal = true;
  }

  showEventModal() {
    this.eventColumns = [
      { field: 'id', header: 'Event Id' },
      { field: 'name', header: 'Name' },
      { field: 'date', header: 'Date' },
      { field: 'baseLocation', header: 'Base Location' },
      { field: 'project', header: 'project' },
      { field: 'category', header: 'Category' },
      { field: 'livesImpacted', header: 'Lives Impacted' },
      { field: 'totalVolunteers', header: 'Total Volunteers' },
      { field: 'totalTravelHours', header: 'Total Travel Hrs' },
      { field: 'totalVolunteerHours', header: 'Total Volunteer Hrs' }
    ];
    this.showEventsModal = true;
  }

}

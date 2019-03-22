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
    this.allVolunteers = this.allEnrollments.map(m => m.associates);
    this.allUniqueVolunteers = this.getUnique(this.allVolunteers, 'id');
    this.allEvents = this.getUnique(this.allEnrollments.map(m => m.events), 'id');
    this.totalEvents = this.allEvents.length;
    this.totalVolunteers = this.allUniqueVolunteers.length;
    this.totalVolunteerHours = 0;
    this.allEvents.forEach(x => {
      this.totalVolunteerHours = this.totalVolunteerHours + x.totalVolunteerHours;
  }); 
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

  getAllAssociates() {
    this.dashboardService.getAllAssociates().subscribe(data => {
      this.allAssociates = data;
      this.totalAssociates = data.length;

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

      this.allEnrollments = data;
      this.filterAssociatesFromEnrollments();
     
    });
  }
  //getAllVolunteers() {
  //  console.log(this.allEnrollments);
  //  this.allVolunteers = this.allEnrollments.map(e => e.associates);
  //  console.log('allvolunters');
  //  console.log(this.allVolunteers);
  //}

  getTopVolunteers() {
    this.topVolunteers = [];
    this.dashboardService.getTopVolunteers(10).subscribe(data => {
      let groupedData = this.groupBy(data, function (item) {
        return [item.id];
      });

      groupedData.forEach(g => this.topVolunteers.push({ associate: g[0], count: g.length }));
      console.log(this.topVolunteers);
    });
  }

  getRecentEvents() {
    this.dashboardService.getAllEvents().subscribe(data => {
      this.recentEvents = data;
    });
  }

  getEventData(){
    this.dashboardService.getAllEvents().subscribe(data => {
      console.log(data);      
      data.forEach(element => {
        let value = element.date.split('T');
        let value2 = value[0].split('-');
        element.date = value2[2]+'-'+value2[1]+'-'+value2[0];
      });
      this.eventGridData = data;
    });    
  }

  //getYearlyVolunteers() {
  //  this.yearlyNewRepeatVolunteers = [];
  //  this.dashboardService.getYearlyVolunteers(5).subscribe(data => {
      
  //    this.yearlyNewRepeatVolunteers = data;
  //    //this.barChart();
  //    //this.columnLineMix();
  //    //this.stackedChart(data);
  //  });
    
  //}
  //getYearlyBuVolunteers() {

  //  this.dashboardService.getYearlyBuVolunteers(5).subscribe(data => {
  //    this.stackedChart(data);
  //  });

  //}
  getDateWiseVolunteersCount() {
    this.topVolunteers = [];
    this.dashboardService.getTopVolunteers(5).subscribe(data => {
      let groupedData = this.groupBy(data, function (item) {
        return [item.id];
      });

      groupedData.forEach(g => this.topVolunteers.push({ associate: g[0], count: g.length }));
      console.log(this.topVolunteers);
    });
  }


  //getAllNewVolunteers() {
  //  this.dashboardService.GetAllNewVolunteers().subscribe(data => {
     
  //    let groupedData = this.groupBy(data, function (item) {
  //      return [item.eventDate];
  //    });
  //    this.allNewVolunteers= groupedData;
  //    console.log('GetAllNewVolunteers');
  //    console.log(groupedData);
      
  //    //this.lineGraph();
  //    this.getDateWiseVolunteers();
  //  });
    
  //}

  getTopData() {
    this.dashboardService.GetTopData().subscribe(data => {
      this.topData = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          this.topData.push({ key: key, count: data[key][0], percent: data[key][1] });
        }
      }
    });

  }

  getDateWiseVolunteers() {
    this.dashboardService.GetDateWiseVolunteers().subscribe(data => {
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
  //joinRecords() {
  //  this.top10Volunteers = [];
  //  this.allVolunteers = [];
  //  this.allEnrollments.map((enrollment) => {
  //    let associate = this.allAssociates.find((en) => enrollment.associateID === en.id);
  //    let event = this.allEvents.find((ev) => enrollment.eventID === ev.id);
  //    if (associate)
  //      this.allVolunteers.push(Object.assign(enrollment, associate, event));

  //  });

  //  let groupedData = this.groupBy(this.allVolunteers, function (item) {
  //    return [item.associateID];
  //  });
  //  let arr = [];
  //  groupedData.forEach(x => {
  //    arr.push({ 'associate': x[0], count: x.length });
  //  });
  //  console.log('arr');
  //  console.log(arr);
  //  this.top10Volunteers.push();

  //  this.lineChart();
  //}

  lineChart() {

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;

    let data = [];
    let volunteers = 0;
    let previousValue;
    let i=0
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
    console.log('data');
    console.log(data);
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

  //stackedChart(data:any[]) {

  //  let chart = am4core.create("chartdiv1", am4charts.XYChart);
  //  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  //  chart.data = data;

  //  chart.colors.step = 2;
  //  chart.padding(30, 30, 10, 30);
  //  chart.legend = new am4charts.Legend();

  //  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //  categoryAxis.dataFields.category = "year";
  //  categoryAxis.renderer.grid.template.location = 0;

  //  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //  valueAxis.min = 0;
  //  valueAxis.max = 100;
  //  valueAxis.strictMinMax = true;
  //  valueAxis.calculateTotals = true;
  //  valueAxis.renderer.minWidth = 50;

  //  //enable responsive
  //  chart.responsive.enabled = true;
  //  chart.responsive.useDefault = false
  //  chart.responsive.enabled = true;

  //  chart.responsive.rules.push({
  //    relevant: function (target) {
  //      if (target.pixelWidth <= 400) { return true; }
  //      return false;
  //    },
  //    state: function (target, stateId) {
  //      if (target instanceof am4charts.Chart) {
  //        var state = target.states.create(stateId);
  //        state.properties.paddingTop = 5;
  //        state.properties.paddingRight = 15;
  //        state.properties.paddingBottom = 5;
  //        state.properties.paddingLeft = 0;
  //        return state;
  //      }
  //      return null;
  //    }
  //  });

  //  let firstObject = data[0];
  //  let keys = Object.keys(firstObject);
  //  let i = 0;
  //  keys.forEach(key => {
  //    if (i > 0) {
  //      let series1 = chart.series.push(new am4charts.ColumnSeries());
  //      series1.columns.template.width = am4core.percent(80);
  //      series1.columns.template.tooltipText =
  //        "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  //      series1.name = key;
  //      series1.dataFields.categoryX = "year";
  //      series1.dataFields.valueY = key;
  //      series1.dataFields.valueYShow = "totalPercent";
  //      series1.dataItems.template.locations.categoryX = 0.5;
  //      series1.stacked = true;
  //      series1.tooltip.pointerOrientation = "vertical";

  //      let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
  //      bullet1.interactionsEnabled = false;
  //      bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //      bullet1.label.fill = am4core.color("#ffffff");
  //      bullet1.locationY = 0.5;
  //    }
  //    i++;
  //  });
    

  //  //let series2 = chart.series.push(new am4charts.ColumnSeries());
  //  //series2.columns.template.width = am4core.percent(80);
  //  //series2.columns.template.tooltipText =
  //  //  "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  //  //series2.name = "Series 2";
  //  //series2.dataFields.categoryX = "category";
  //  //series2.dataFields.valueY = "value2";
  //  //series2.dataFields.valueYShow = "totalPercent";
  //  //series2.dataItems.template.locations.categoryX = 0.5;
  //  //series2.stacked = true;
  //  //series2.tooltip.pointerOrientation = "vertical";

  //  //let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
  //  //bullet2.interactionsEnabled = false;
  //  //bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //  //bullet2.locationY = 0.5;
  //  //bullet2.label.fill = am4core.color("#ffffff");

  //  //let series3 = chart.series.push(new am4charts.ColumnSeries());
  //  //series3.columns.template.width = am4core.percent(80);
  //  //series3.columns.template.tooltipText =
  //  //  "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  //  //series3.name = "Series 3";
  //  //series3.dataFields.categoryX = "category";
  //  //series3.dataFields.valueY = "value3";
  //  //series3.dataFields.valueYShow = "totalPercent";
  //  //series3.dataItems.template.locations.categoryX = 0.5;
  //  //series3.stacked = true;
  //  //series3.tooltip.pointerOrientation = "vertical";

  //  //let bullet3 = series3.bullets.push(new am4charts.LabelBullet());
  //  //bullet3.interactionsEnabled = false;
  //  //bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //  //bullet3.locationY = 0.5;
  //  //bullet3.label.fill = am4core.color("#ffffff");

  //  chart.scrollbarX = new am4core.Scrollbar();

  //}

  //barChart() {
  //  // Create chart instance
  //  this.chart = am4core.create("barChart", am4charts.XYChart);

  //  // Add data
  //  this.chart.data = this.yearlyNewRepeatVolunteers;

  //  // Create axes
  //  let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
  //  categoryAxis.dataFields.category = "year";
  //  categoryAxis.numberFormatter.numberFormat = "#";
  //  categoryAxis.renderer.inversed = true;
  //  categoryAxis.renderer.grid.template.location = 0;
  //  categoryAxis.renderer.cellStartLocation = 0.1;
  //  categoryAxis.renderer.cellEndLocation = 0.9;

  //  let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
  //  valueAxis.renderer.opposite = true;


  //  this.createSeries("newVolunteers", "New Volunteers");
  //  this.createSeries("repeatedVolunteers", "Recurring Volunteers");
  //}

  //columnLineMix() {

  //  // Create chart instance
  //  let chart = am4core.create("columnLineMix", am4charts.XYChart);

  //  // Export
  //  chart.exporting.menu = new am4core.ExportMenu();

  //  // Data for both series
  //  let data = this.yearlyNewRepeatVolunteers;

  //  /* Create axes */
  //  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //  categoryAxis.dataFields.category = "year";
  //  categoryAxis.renderer.minGridDistance = 30;

  //  /* Create value axis */
  //  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  //  /* Create series */
  //  let columnSeries = chart.series.push(new am4charts.ColumnSeries());
  //  columnSeries.name = "Recurring Volunteers";
  //  columnSeries.dataFields.valueY = "repeatedVolunteers";
  //  columnSeries.dataFields.categoryX = "year";

  //  columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
  //  columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
  //  columnSeries.columns.template.propertyFields.stroke = "stroke";
  //  columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
  //  columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
  //  columnSeries.tooltip.label.textAlign = "middle";

  //  let lineSeries = chart.series.push(new am4charts.LineSeries());
  //  lineSeries.name = "New Volunteers";
  //  lineSeries.dataFields.valueY = "newVolunteers";
  //  lineSeries.dataFields.categoryX = "year";

  //  lineSeries.stroke = am4core.color("#fdd400");
  //  lineSeries.strokeWidth = 3;
  //  lineSeries.propertyFields.strokeDasharray = "lineDash";
  //  lineSeries.tooltip.label.textAlign = "middle";

  //  let bullet = lineSeries.bullets.push(new am4charts.Bullet());
  //  bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
  //  bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
  //  let circle = bullet.createChild(am4core.Circle);
  //  circle.radius = 4;
  //  circle.fill = am4core.color("#fff");
  //  circle.strokeWidth = 3;

  //  chart.data = data;
  //}

  lineGraph(chartData) {

    // Create chart instance
    let chart = am4core.create("volunteersGraph", am4charts.XYChart);

    // Add data
    chart.data = chartData.reverse();

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
    chart.scrollbarX.series.push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
  }
  lineGraph1(chartData:any[]){
    let chart = am4core.create("volunteersGraph", am4charts.XYChart);

// let data = [];
// let value = 50;
// for(let i = 0; i < 300; i++){
//   let date = new Date();
//   date.setHours(0,0,0,0);
//   date.setDate(i);
//   value -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
//   data.push({date:date, value: value});
// }
//let data = [];
//this.allNewVolunteers.forEach(g => data.push({ date: g[0].eventDate, value: g.length }));
    chart.data = chartData.reverse();

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "new";
series.dataFields.dateX = "date";
series.tooltipText = "{newVolunteer}"

series.tooltip.pointerOrientation = "vertical";

chart.cursor = new am4charts.XYCursor();
chart.cursor.snapToSeries = series;
chart.cursor.xAxis = dateAxis;

//chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarX = new am4core.Scrollbar();

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

  //columnChart() {

  //  // Create chart instance
  //  let chart = am4core.create("columnChart", am4charts.XYChart);

  //  // Add percent sign to all numbers
  //  chart.numberFormatter.numberFormat = "#.3'%'";

  //  // Add data
  //  chart.data = [];//this.yearlyData.reverse();

  //  // Create axes
  //  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //  categoryAxis.dataFields.category = "year";
  //  categoryAxis.renderer.grid.template.location = 0;
  //  categoryAxis.renderer.minGridDistance = 30;

  //  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //  valueAxis.title.text = "GDP growth rate";
  //  //valueAxis.title.fontWeight = 800;

  //  // Create series
  //  let series = chart.series.push(new am4charts.ColumnSeries());
  //  series.dataFields.valueY = "newVolunteer";
  //  series.dataFields.categoryX = "year";
  //  series.clustered = false;
  //  series.tooltipText = "GDP grow in {categoryX} (2004): [bold]{valueY}[/]";

  //  let series2 = chart.series.push(new am4charts.ColumnSeries());
  //  series2.dataFields.valueY = "recurVolunteer";
  //  series2.dataFields.categoryX = "year";
  //  series2.clustered = false;
  //  series2.columns.template.width = am4core.percent(50);
  //  series2.tooltipText = "GDP grow in {categoryX} (2005): [bold]{valueY}[/]";

  //  chart.cursor = new am4charts.XYCursor();
  //  chart.cursor.lineX.disabled = true;
  //  chart.cursor.lineY.disabled = true;

  //}
  //radioModel: string = 'Month';

  //// lineChart1
  //public lineChart1Data: Array<any> = [
  //  {
  //    data: [65, 59, 84, 84, 51, 55, 40],
  //    label: 'Series A'
  //  }
  //];
  //public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  //public lineChart1Options: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips
  //  },
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      gridLines: {
  //        color: 'transparent',
  //        zeroLineColor: 'transparent'
  //      },
  //      ticks: {
  //        fontSize: 2,
  //        fontColor: 'transparent',
  //      }

  //    }],
  //    yAxes: [{
  //      display: false,
  //      ticks: {
  //        display: false,
  //        min: 40 - 5,
  //        max: 84 + 5,
  //      }
  //    }],
  //  },
  //  elements: {
  //    line: {
  //      borderWidth: 1
  //    },
  //    point: {
  //      radius: 4,
  //      hitRadius: 10,
  //      hoverRadius: 4,
  //    },
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public lineChart1Colours: Array<any> = [
  //  {
  //    backgroundColor: getStyle('--primary'),
  //    borderColor: 'rgba(255,255,255,.55)'
  //  }
  //];
  //public lineChart1Legend = false;
  //public lineChart1Type = 'line';

  //// lineChart2
  //public lineChart2Data: Array<any> = [
  //  {
  //    data: [1, 18, 9, 17, 34, 22, 11],
  //    label: 'Series A'
  //  }
  //];
  //public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  //public lineChart2Options: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips
  //  },
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      gridLines: {
  //        color: 'transparent',
  //        zeroLineColor: 'transparent'
  //      },
  //      ticks: {
  //        fontSize: 2,
  //        fontColor: 'transparent',
  //      }

  //    }],
  //    yAxes: [{
  //      display: false,
  //      ticks: {
  //        display: false,
  //        min: 1 - 5,
  //        max: 34 + 5,
  //      }
  //    }],
  //  },
  //  elements: {
  //    line: {
  //      tension: 0.00001,
  //      borderWidth: 1
  //    },
  //    point: {
  //      radius: 4,
  //      hitRadius: 10,
  //      hoverRadius: 4,
  //    },
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public lineChart2Colours: Array<any> = [
  //  { // grey
  //    backgroundColor: getStyle('--info'),
  //    borderColor: 'rgba(255,255,255,.55)'
  //  }
  //];
  //public lineChart2Legend = false;
  //public lineChart2Type = 'line';


  //// lineChart3
  //public lineChart3Data: Array<any> = [
  //  {
  //    data: [78, 81, 80, 45, 34, 12, 40],
  //    label: 'Series A'
  //  }
  //];
  //public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  //public lineChart3Options: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips
  //  },
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      display: false
  //    }],
  //    yAxes: [{
  //      display: false
  //    }]
  //  },
  //  elements: {
  //    line: {
  //      borderWidth: 2
  //    },
  //    point: {
  //      radius: 0,
  //      hitRadius: 10,
  //      hoverRadius: 4,
  //    },
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public lineChart3Colours: Array<any> = [
  //  {
  //    backgroundColor: 'rgba(255,255,255,.2)',
  //    borderColor: 'rgba(255,255,255,.55)',
  //  }
  //];
  //public lineChart3Legend = false;
  //public lineChart3Type = 'line';


  //// barChart1
  //public barChart1Data: Array<any> = [
  //  {
  //    data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
  //    label: 'Series A'
  //  }
  //];
  //public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  //public barChart1Options: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips
  //  },
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      display: false,
  //      barPercentage: 0.6,
  //    }],
  //    yAxes: [{
  //      display: false
  //    }]
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public barChart1Colours: Array<any> = [
  //  {
  //    backgroundColor: 'rgba(255,255,255,.3)',
  //    borderWidth: 0
  //  }
  //];
  //public barChart1Legend = false;
  //public barChart1Type = 'bar';

  // mainChart

  //public mainChartElements = 27;
  //public mainChartData1: Array<number> = [];
  //public mainChartData2: Array<number> = [];
  //public mainChartData3: Array<number> = [];

  //public mainChartData: Array<any> = [
  //  {
  //    data: this.mainChartData1,
  //    label: 'Current'
  //  },
  //  {
  //    data: this.mainChartData2,
  //    label: 'Previous'
  //  },
  //  {
  //    data: this.mainChartData3,
  //    label: 'BEP'
  //  }
  //];
  ///* tslint:disable:max-line-length */
  //public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  ///* tslint:enable:max-line-length */
  //public mainChartOptions: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips,
  //    intersect: true,
  //    mode: 'index',
  //    position: 'nearest',
  //    callbacks: {
  //      labelColor: function (tooltipItem, chart) {
  //        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
  //      }
  //    }
  //  },
  //  responsive: true,
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      gridLines: {
  //        drawOnChartArea: false,
  //      },
  //      ticks: {
  //        callback: function (value: any) {
  //          return value.charAt(0);
  //        }
  //      }
  //    }],
  //    yAxes: [{
  //      ticks: {
  //        beginAtZero: true,
  //        maxTicksLimit: 5,
  //        stepSize: Math.ceil(250 / 5),
  //        max: 250
  //      }
  //    }]
  //  },
  //  elements: {
  //    line: {
  //      borderWidth: 2
  //    },
  //    point: {
  //      radius: 0,
  //      hitRadius: 10,
  //      hoverRadius: 4,
  //      hoverBorderWidth: 3,
  //    }
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public mainChartColours: Array<any> = [
  //  { // brandInfo
  //    backgroundColor: hexToRgba(getStyle('--info'), 10),
  //    borderColor: getStyle('--info'),
  //    pointHoverBackgroundColor: '#fff'
  //  },
  //  { // brandSuccess
  //    backgroundColor: 'transparent',
  //    borderColor: getStyle('--success'),
  //    pointHoverBackgroundColor: '#fff'
  //  },
  //  { // brandDanger
  //    backgroundColor: 'transparent',
  //    borderColor: getStyle('--danger'),
  //    pointHoverBackgroundColor: '#fff',
  //    borderWidth: 1,
  //    borderDash: [8, 5]
  //  }
  //];
  //public mainChartLegend = false;
  //public mainChartType = 'line';

  //// social box charts

  //public brandBoxChartData1: Array<any> = [
  //  {
  //    data: [65, 59, 84, 84, 51, 55, 40],
  //    label: 'Facebook'
  //  }
  //];
  //public brandBoxChartData2: Array<any> = [
  //  {
  //    data: [1, 13, 9, 17, 34, 41, 38],
  //    label: 'Twitter'
  //  }
  //];
  //public brandBoxChartData3: Array<any> = [
  //  {
  //    data: [78, 81, 80, 45, 34, 12, 40],
  //    label: 'LinkedIn'
  //  }
  //];
  //public brandBoxChartData4: Array<any> = [
  //  {
  //    data: [35, 23, 56, 22, 97, 23, 64],
  //    label: 'Google+'
  //  }
  //];

  //public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  //public brandBoxChartOptions: any = {
  //  tooltips: {
  //    enabled: false,
  //    custom: CustomTooltips
  //  },
  //  responsive: true,
  //  maintainAspectRatio: false,
  //  scales: {
  //    xAxes: [{
  //      display: false,
  //    }],
  //    yAxes: [{
  //      display: false,
  //    }]
  //  },
  //  elements: {
  //    line: {
  //      borderWidth: 2
  //    },
  //    point: {
  //      radius: 0,
  //      hitRadius: 10,
  //      hoverRadius: 4,
  //      hoverBorderWidth: 3,
  //    }
  //  },
  //  legend: {
  //    display: false
  //  }
  //};
  //public brandBoxChartColours: Array<any> = [
  //  {
  //    backgroundColor: 'rgba(255,255,255,.1)',
  //    borderColor: 'rgba(255,255,255,.55)',
  //    pointHoverBackgroundColor: '#fff'
  //  }
  //];
  //public brandBoxChartLegend = false;
  //public brandBoxChartType = 'line';

  //public random(min: number, max: number) {
  //  return Math.floor(Math.random() * (max - min + 1) + min);
  //}


}

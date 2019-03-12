import { Component, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { OnInit } from '@angular/core';
import { ParticipationService } from '../../../services/participation.service';

import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { HostListener } from '@angular/core';

import { Event } from '../../../models/event.model';
import { Associate } from '../../../models/associate.model';
import { Enrollment } from '../../../models/enrollment.model';
//import {TieredMenuModule} from 'primeng/tieredmenu';

am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'participation.component.html'
})
export class ParticipationComponent implements OnInit {

  private chart: am4charts.XYChart;
  public innerWidth: any;

  showDesignationData: boolean = false;
  allAssociates: Associate[] = [];
  allEvents: Event[] = [];
  allEnrollments: Enrollment[] = [];
  allVolunteers: any[] = [];
  allUniqueVolunteers: Associate[] = [];

  totalVolunteerHours: number;
  totalTravelHours: number;
  totalVolunteeringHours: number;

  totalAssociates: number;
  totalVolunteers: number;
  uniqueVolunteers: number;

  coverage: string;
  averageFreqVolunteer: string;
  avgHourAssociate: number;
  avgHourVolunteer: number;
  totalEvents: number;
  avgHoursPerEventWeekday: number;
  avgHoursPerEventWeekend: number;
  avgVolunteersEvent: number;
  avgHourVolunteerEvent: number;

  designationWiseAssociates: any[];
  designationWiseVolunteers: any[];

  buWiseAssociates: any[];
  buWiseVolunteers: any[];

  locationWiseAssociates: any[];
  locationWiseVolunteers: any[];

  countryWiseAssociates: any[];
  countryWiseVolunteers: any[];

  isVolunteersVsAssociates: boolean = false;
  combinedResult: any[];
  constructor(private zone: NgZone, private participationService: ParticipationService) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getAllAssociates();
    //this.getAllEnrollments();
    this.innerWidth = window.innerWidth;

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

  getAllAssociates() {
    this.participationService.getAllAssociates().subscribe(data => {
      this.allAssociates = data;
      this.totalAssociates = data.length;
      this.getAllEvents();
    });
  }
  getAllEvents() {
    this.participationService.getAllEvents().subscribe(data => {
      this.allEvents = data;
      this.getEnrollments();
    });
  }
  getEnrollments() {
    this.participationService.getEnrollments().subscribe(data => {
      this.allEnrollments = data;

      this.getVolunteers();
    });
  }

  getVolunteers() {
    this.participationService.getUniqueVolunteers().subscribe(data => {
      this.allUniqueVolunteers = data;
      //this.allUniqueVolunteers = data.filter(function (item, pos) {
      //  return data.indexOf(item) == pos;
      //});

      this.metricCalculate();
      this.getAllChartData();
    });
  }
  
  joinRecords(){
    this.allVolunteers =[];
  this.allEnrollments.map((enrollment)=>{
    let associate = this.allAssociates.find((en)=> enrollment.associateID === en.id);
    //let event = this.allEvents.find((ev)=> enrollment.eventID === ev.id);
    if(associate)
    this.allVolunteers.push(Object.assign(enrollment, associate));
     //Object.assign(a,obj2);
    //return a;
   });
   console.log('combinedResult');
   console.log(this.allVolunteers);
    this.metricCalculate();
      this.getAllChartData();
  }

  getAllChartData(){
    console.log('test1');
    this.getDesignationWiseAssociates();
    this.getDesignationWiseVolunteers();
    this.getBUWiseAssociates();
    this.getBUWiseVolunteers();
    this.getBaseLocationWiseAssociates();
    this.getBaseLocationWiseVolunteers();
   // this.getCountryWiseAssociates();
    //this.getCountryWiseVolunteers();
    this.showCharts();
  }

  showCharts() {
    this.pieChart('DesignationWiseReport');
    //this.stacked3dChart();
    this.layeredColumnChart("DesignationWiseVolunteersVsAssociates");
    this.layeredColumnChart("BuWiseVolunteersVsAssociates");
    this.layeredColumnChart("LocationWiseVolunteersVsAssociates");
    this.columnChart3d('BuWiseReport');
    this.doughnut('LocationWiseReport');
  }
  getDesignationWiseAssociates() {
    this.designationWiseAssociates = this.groupBy(this.allAssociates, function (item) {
      return [item.designation];
    });
  }
  getDesignationWiseVolunteers() {
    this.designationWiseVolunteers = this.groupBy(this.allUniqueVolunteers, function (item) {
      return [item.designation];
    });
  }
  getBUWiseAssociates() {
    this.buWiseAssociates = this.groupBy(this.allAssociates, function (item) {
      return [item.businessUnit];
    });
  }
  getBUWiseVolunteers() {
    this.buWiseVolunteers = this.groupBy(this.allUniqueVolunteers, function (item) {
      return [item.businessUnit];
    });
  }
  getBaseLocationWiseAssociates() {
    this.locationWiseAssociates = this.groupBy(this.allAssociates, function (item) {
      return [item.baseLocation];
    });
  }
  getBaseLocationWiseVolunteers() {
    this.locationWiseVolunteers = this.groupBy(this.allUniqueVolunteers, function (item) {
      return [item.baseLocation];
    });
  }
  //getCountryWiseAssociates() {
  //  this.countryWiseAssociates = this.groupBy(this.allAssociates, function (item) {
  //    return [item.country];
  //  });
  //}
  //getCountryWiseVolunteers() {
  //  this.countryWiseVolunteers = this.groupBy(this.allUniqueVolunteers, function (item) {
  //    return [item.country];
  //  });
  //}

  metricCalculate() {

    this.totalAssociates = this.allAssociates.length;
    this.totalVolunteers = this.allEnrollments.length;
    this.uniqueVolunteers = this.allUniqueVolunteers.length;

    let total: number = 0;
    let total1: number = 0;
    let totalVolunteers: number = 0;
    this.totalTravelHours = 0;
    this.totalVolunteerHours = 0;
    let weekdayHours = 0;
    let weekendHours = 0;
    let weekdayCount = 0;
    let weekendCount = 0;
    this.allEvents.forEach(event => {

      this.totalTravelHours = this.totalTravelHours + event.totalTravelHours;
      this.totalVolunteerHours = this.totalVolunteerHours + event.totalVolunteerHours;
      total = total + event.totalTravelHours + event.totalVolunteerHours;
      total1 = 0;
      let d = new Date(event.date);
      let n = d.getDay();
      if (n == 0 || n == 6) {
        total1 = this.totalTravelHours + event.totalTravelHours;
        weekendHours = weekendHours + total1;
        weekendCount++;
      } else {
        total1 = this.totalTravelHours + event.totalTravelHours;
        weekdayHours = weekdayHours + total1;
        weekdayCount++;
      }
    });
    this.totalVolunteeringHours = total;

    console.log('this.uniqueVolunteers');
    console.log(this.uniqueVolunteers);
    console.log(this.totalAssociates);

   let cover =  this.uniqueVolunteers / this.totalAssociates;
    this.coverage = cover.toFixed(2);
      let avgFreq = this.uniqueVolunteers / this.totalVolunteers;
    this.averageFreqVolunteer = avgFreq.toFixed(2);

    this.avgHourAssociate = Math.floor(this.totalVolunteeringHours / this.totalAssociates);
    this.avgHourVolunteer = Math.floor(this.totalVolunteeringHours / this.uniqueVolunteers);
    this.totalEvents = this.allEvents.length;

    let avgVolunteeredHours = 0;

    this.avgHoursPerEventWeekday = weekdayHours / weekdayCount;
    this.avgHoursPerEventWeekend = weekendHours / weekendCount;

    this.avgVolunteersEvent = this.totalVolunteers / this.totalEvents;

    this.avgHourVolunteerEvent = Math.floor(avgVolunteeredHours / this.totalEvents);
  }


  getSum(total, arr) {
    let prev: number = isNaN(total.volunteerHours) ? 0 : total.volunteerHours;
    let cur: number = isNaN(arr.volunteerHours) ? 0 : arr.volunteerHours;
    return prev + cur;
  }

  getDesignationWiseAssociatesData(): any {
    let data = [];
    this.designationWiseAssociates.forEach(associates =>
      data.push({ designation: associates[0].designation, associates: associates.length }));
    return data;
  }
  getDesignationWiseVolunteersData(): any {
    let data = [];
    this.designationWiseVolunteers.forEach(volunteers =>
      data.push({ designation: volunteers[0].designation, volunteers: volunteers.length }));
      console.log(data);
    return data;
  }
  getDesignationWiseVolunteerVsAssociate(): any {
    let data = [];
    this.designationWiseVolunteers.forEach(volunteers => {
      let associates = this.allAssociates.filter(f => f.designation == volunteers[0].designation);
      data.push({ designation: volunteers[0].designation, volunteers: volunteers.length, associates: associates.length })
    });  
    console.log(data);
    return data;
  }
  getBUWiseAssociatesData(): any {
    let data = [];
    this.buWiseAssociates.forEach(associates =>
      data.push({ businessUnit: associates[0].businessUnit, associates: associates.length }));
    return data;
  }
  getBUWiseVolunteersData(): any {
    let data = [];
    this.buWiseVolunteers.forEach(volunteers =>
      data.push({ businessUnit: volunteers[0].businessUnit, volunteers: volunteers.length }));
    return data;
  }
  getBuWiseVolunteerVsAssociate(): any {
    let data = [];
    this.buWiseVolunteers.forEach(volunteers => {
      let associates = this.allAssociates.filter(f => f.businessUnit == volunteers[0].businessUnit);
      data.push({ businessUnit: volunteers[0].businessUnit, volunteers: volunteers.length, associates: associates.length })
    });
    console.log(data);
    return data;
  }
  getLocationWiseAssociatesData(): any {
    let data = [];
    this.locationWiseAssociates.forEach(associates =>
      data.push({ baseLocation: associates[0].baseLocation, associates: associates.length }));
    return data;
  }
  getLocationWiseVolunteersData(): any {
    let data = [];
    this.locationWiseVolunteers.forEach(volunteers =>
      data.push({ baseLocation: volunteers[0].baseLocation, volunteers: volunteers.length }));
    return data;
  }
  getLocationWiseVolunteerVsAssociate(): any {
    let data = [];
    this.locationWiseVolunteers.forEach(volunteers => {
      let associates = this.allAssociates.filter(f => f.baseLocation == volunteers[0].baseLocation);
      data.push({ baseLocation: volunteers[0].baseLocation, volunteers: volunteers.length, associates: associates.length })
    });
    console.log(data);
    return data;
  }

  getChartData(chartType: string): any {
    console.log('test4');
    console.log(this.designationWiseVolunteers);
    if (chartType == 'DesignationWiseReport') {
      return this.getDesignationWiseVolunteersData();
    }
      
    else if (chartType == 'BuWiseReport')
      return this.getBUWiseVolunteersData();
    else if (chartType == 'LocationWiseReport')
      return this.getLocationWiseVolunteersData();
    else return null;
  }

  pieChart(chartContainer: string) {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create(chartContainer, am4charts.PieChart);

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
      chart.data = this.getChartData(chartContainer);


      let category: string;
      let titleText: string;
      let valueY: string;
      let seriesName: string;
      if (chartContainer == 'DesignationWiseReport') {
        category = "designation";
      }
      else if (chartContainer == 'BuWiseReport') {
        category = "businessUnit";
      }
      else if (chartContainer == 'LocationWiseReport') {
        category = "baseLocation";
      }

      pieSeries.dataFields.value = "volunteers";
      pieSeries.dataFields.category = category;
    });
  }

  columnChart(chartContainer: string) {
    // Create chart instance
    let chart = am4core.create(chartContainer, am4charts.XYChart);

    //data source
    chart.data = this.getChartData(chartContainer);

    let category: string;
    let titleText: string;
    let valueY: string;
    let seriesName: string;
    if (chartContainer == 'DesignationWiseReport') {
      category = "designation";
      titleText = "Designation";
      valueY = "volunteers";
      seriesName = "Volunteers";
    }
    else if (chartContainer == 'BuWiseReport') {
      category = "businessUnit";
      titleText = "Business Unit";
      valueY = "volunteers";
      seriesName = "Volunteers";
    }
    else if (chartContainer == 'LocationWiseReport') {
      category = "baseLocation";
      titleText = "Base Location";
      valueY = "volunteers";
      seriesName = "Volunteers";
    }

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index && 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
  
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
        // //remove label
        // series.ticks.template.disabled = true;
        // series.alignLabels = false;
        // series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        // series.labels.template.radius = am4core.percent(-40);
        // series.labels.template.fill = am4core.color("white");
      }

    series.dataFields.valueY = "volunteers";
    series.dataFields.categoryX = category;
    series.name = seriesName;
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    // This creates initial animation
    series.hiddenState.properties.opacity = 1;
  }

  columnChart3d(chartContainer: string) {
    // Create chart instance
    let chart = am4core.create(chartContainer, am4charts.XYChart3D);

    //data source
    chart.data = this.getChartData(chartContainer);

    let category: string;
    let titleText: string;
    let valueY: string;
    let seriesName: string;
    if (chartContainer == 'DesignationWiseReport') {
      category = "designation";
      titleText = "Designation";
      valueY = "volunteers";
      seriesName = "Volunteers";
    }
    else if (chartContainer == 'BuWiseReport') {
      category = "businessUnit";
      titleText = "Business Unit";
      valueY = "volunteers";
      seriesName = "Volunteers";
    }
    else if (chartContainer == 'LocationWiseReport') {
      category = "baseLocation";
      titleText = "Base Location";
      valueY = "volunteers";
      seriesName = "Volunteers";
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
        // //remove label
        // series.ticks.template.disabled = true;
        // series.alignLabels = false;
        // series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        // series.labels.template.radius = am4core.percent(-40);
        // series.labels.template.fill = am4core.color("white");
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

  doughnut(chartContainer: string) {
    let chart = am4core.create(chartContainer, am4charts.PieChart);

    // Set inner radius
    chart.innerRadius = am4core.percent(50);

     //data source
    chart.data = this.getChartData(chartContainer);

    let pieSeries = chart.series.push(new am4charts.PieSeries());

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
        // //remove label
        // series.ticks.template.disabled = true;
        // series.alignLabels = false;
        // series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        // series.labels.template.radius = am4core.percent(-40);
        // series.labels.template.fill = am4core.color("white");
      }
    let category: string;
    if (chartContainer == 'DesignationWiseReport') {
      category = "designation";
    }
    else if (chartContainer == 'BuWiseReport') {
      category = "businessUnit";
    }
    else if (chartContainer == 'LocationWiseReport') {
      category = "baseLocation";
    }

    pieSeries.dataFields.value = "volunteers";
    pieSeries.dataFields.category = category;
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

  }

  pyramid(chartContainer: string) {
    let chart = am4core.create(chartContainer, am4charts.SlicedChart);
    chart.paddingBottom = 30;

     //data source
     chart.data = this.getChartData(chartContainer);
    
    let series = chart.series.push(new am4charts.PyramidSeries());

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
        // //remove label
        // series.ticks.template.disabled = true;
        // series.alignLabels = false;
        // series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        // series.labels.template.radius = am4core.percent(-40);
        // series.labels.template.fill = am4core.color("white");
      }

    let category: string;
    if (chartContainer == 'DesignationWiseReport') {
      category = "designation";
    }
    else if (chartContainer == 'BuWiseReport') {
      category = "businessUnit";
    }
    else if (chartContainer == 'LocationWiseReport') {
      category = "baseLocation";
    }

    series.dataFields.value = "volunteers";
    series.dataFields.category = category;
    series.alignLabels = true;
    series.valueIs = "height";

  }

  barChart(htmlElement: string) {
    // Create chart instance
    let chart = am4core.create(htmlElement, am4charts.XYChart3D);


    // Add data
    chart.data = [{
      "year": 2005,
      "income": 23.5,
      "color": chart.colors.next()
    }, {
      "year": 2006,
      "income": 26.2,
      "color": chart.colors.next()
    }, {
      "year": 2007,
      "income": 30.1,
      "color": chart.colors.next()
    }, {
      "year": 2008,
      "income": 29.5,
      "color": chart.colors.next()
    }, {
      "year": 2009,
      "income": 24.6,
      "color": chart.colors.next()
    }];

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueX = "income";
    series.dataFields.categoryY = "year";
    series.name = "Income";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{valueX}";
    series.columns.template.column3D.stroke = am4core.color("#fff");
    series.columns.template.column3D.strokeOpacity = 0.2;

  }

  stackedChart(htmlElement: string) {

    let chart = am4core.create(htmlElement, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        category: "One",
        value1: 1,
        value2: 5,
        value3: 3
      },
      {
        category: "Two",
        value1: 2,
        value2: 5,
        value3: 3
      },
      {
        category: "Three",
        value1: 3,
        value2: 5,
        value3: 4
      },
      {
        category: "Four",
        value1: 4,
        value2: 5,
        value3: 6
      },
      {
        category: "Five",
        value1: 3,
        value2: 5,
        value3: 4
      },
      {
        category: "Six",
        value1: 2,
        value2: 13,
        value3: 1
      }
    ];

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;


    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series1.name = "Series 1";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet1.label.fill = am4core.color("#ffffff");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series2.name = "Series 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.columns.template.width = am4core.percent(80);
    series3.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series3.name = "Series 3";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.categoryX = 0.5;
    series3.stacked = true;
    series3.tooltip.pointerOrientation = "vertical";

    let bullet3 = series3.bullets.push(new am4charts.LabelBullet());
    bullet3.interactionsEnabled = false;
    bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet3.locationY = 0.5;
    bullet3.label.fill = am4core.color("#ffffff");

    chart.scrollbarX = new am4core.Scrollbar();

  }

  designationChart(type?: string) {
    this.zone.runOutsideAngular(() => {
      let chart;
      if (type == 'pyrmid')
        chart = am4core.create("chartdiv", am4charts.SlicedChart);
      else if (type == 'doughnut')
        chart = am4core.create("chartdiv", am4charts.PieChart3D);
      else
        chart = am4core.create("chartdiv", am4charts.PieChart);


      // Enable export
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.filePrefix = 'Designation wise particiption report';

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
      let pieSeries;
      if (type == 'pyrmid') {
        pieSeries = chart.series.push(new am4charts.PyramidSeries());
        pieSeries.alignLabels = true;
        pieSeries.valueIs = "height";
      }
      else if (type == 'doughnut')
        pieSeries = chart.series.push(new am4charts.PieSeries3D());
      else
        pieSeries = chart.series.push(new am4charts.PieSeries());

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
      let data = [];
      this.designationWiseVolunteers.forEach(volunteers =>
        data.push({ designation: volunteers[0].designation, volunteers: volunteers.length }))
      chart.data = data;
      pieSeries.dataFields.value = "volunteers";
      pieSeries.dataFields.category = "designation";
    });
  }

  pieChart2(type?) {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.PieChart);


      let data = [];
      this.designationWiseVolunteers.forEach(volunteers =>
        data.push({ designation: volunteers[0].designation, volunteers: volunteers.length }))
      chart.data = data;
      // Enable export
      chart.exporting.menu = new am4core.ExportMenu();

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

      //legend
      chart.exporting.filePrefix = 'designation wise report';
      chart.legend = new am4charts.Legend();
      chart.legend.position = "right";

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "volunteers";
      pieSeries.dataFields.category = "designation";
    });
  }

  pieChart1() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv7", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.legend = new am4charts.Legend();

      chart.data = this.buWiseVolunteers;
      // Enable export
      chart.exporting.menu = new am4core.ExportMenu();

      chart.responsive.useDefault = false
      chart.responsive.enabled = true;

      chart.responsive.rules.push({
        relevant: function (target) {
          if (target.pixelWidth <= 400) {
            return true;
          }

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

      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "volunteers";
      series.dataFields.category = "businessUnit";
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

  pictorialChart() {
    let iconPath = "M421.976,136.204h-23.409l-0.012,0.008c-0.19-20.728-1.405-41.457-3.643-61.704l-1.476-13.352H5.159L3.682,74.507 C1.239,96.601,0,119.273,0,141.895c0,65.221,7.788,126.69,22.52,177.761c7.67,26.588,17.259,50.661,28.5,71.548  c11.793,21.915,25.534,40.556,40.839,55.406l4.364,4.234h206.148l4.364-4.234c15.306-14.85,29.046-33.491,40.839-55.406  c11.241-20.888,20.829-44.96,28.5-71.548c0.325-1.127,0.643-2.266,0.961-3.404h44.94c49.639,0,90.024-40.385,90.024-90.024  C512,176.588,471.615,136.204,421.976,136.204z M421.976,256.252h-32c3.061-19.239,5.329-39.333,6.766-60.048h25.234  c16.582,0,30.024,13.442,30.024,30.024C452,242.81,438.558,256.252,421.976,256.252z"

    let chart = am4core.create("chartdiv2", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.paddingLeft = 150;

    chart.responsive.useDefault = false
    chart.responsive.enabled = true;

    chart.responsive.rules.push({
      relevant: function (target) {
        if (target.pixelWidth <= 400) {
          return true;
        }

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

    chart.data = [{
      "name": "Associates",
      "value": 55
    }, {
      "name": "Volunteers",
      "value": 5
    }];

    let series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.alignLabels = true;
    // this makes only A label to be visible
    //series.labels.template.propertyFields.disabled = "disabled";
    //series.ticks.template.propertyFields.disabled = "disabled";


    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0;

    series.labelsContainer.width = 100;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.paddingRight = 160;
    chart.legend.paddingBottom = 40;
    let marker = chart.legend.markers.template.children.getIndex(0);
    chart.legend.markers.template.width = 40;
    chart.legend.markers.template.height = 40;
    //marker.cornerRadius(20,20,20,20);



  }

  simpleColumnChart() {
    // Create chart instance
    let chart = am4core.create("chartdiv6", am4charts.XYChart);

    // Add data
    chart.data = [{
      "country": "USA",
      "visits": 2025
    }, {
      "country": "China",
      "visits": 1882
    }, {
      "country": "Japan",
      "visits": 1809
    }, {
      "country": "Germany",
      "visits": 1322
    }, {
      "country": "UK",
      "visits": 1122
    }, {
      "country": "France",
      "visits": 1114
    }, {
      "country": "India",
      "visits": 984
    }, {
      "country": "Spain",
      "visits": 711
    }, {
      "country": "Netherlands",
      "visits": 665
    }, {
      "country": "Russia",
      "visits": 580
    }, {
      "country": "South Korea",
      "visits": 443
    }, {
      "country": "Canada",
      "visits": 441
    }, {
      "country": "Brazil",
      "visits": 395
    }];

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index && 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

  }

  rotatedSeriesChart() {
    // Create chart instance
    let chart = am4core.create("chartdiv7", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
      "country": "USA",
      "visits": 3025
    }, {
      "country": "China",
      "visits": 1882
    }, {
      "country": "Japan",
      "visits": 1809
    }, {
      "country": "Germany",
      "visits": 1322
    }, {
      "country": "UK",
      "visits": 1122
    }, {
      "country": "France",
      "visits": 1114
    }, {
      "country": "India",
      "visits": 984
    }, {
      "country": "Spain",
      "visits": 711
    }, {
      "country": "Netherlands",
      "visits": 665
    }, {
      "country": "Russia",
      "visits": 580
    }, {
      "country": "South Korea",
      "visits": 443
    }, {
      "country": "Canada",
      "visits": 441
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    })

    // Cursor
    chart.cursor = new am4charts.XYCursor();
  }

  cylinderChart() {

    // Create chart instance
    let chart = am4core.create("chartdiv8", am4charts.XYChart3D);
    chart.paddingBottom = 30;
    chart.angle = 35;

    // Add data
    chart.data = [{
      "country": "USA",
      "visits": 4025
    }, {
      "country": "China",
      "visits": 1882
    }, {
      "country": "Japan",
      "visits": 1809
    }, {
      "country": "Germany",
      "visits": 1322
    }, {
      "country": "UK",
      "visits": 1122
    }, {
      "country": "France",
      "visits": 1114
    }, {
      "country": "India",
      "visits": 984
    }, {
      "country": "Spain",
      "visits": 711
    }, {
      "country": "Netherlands",
      "visits": 665
    }, {
      "country": "Russia",
      "visits": 580
    }, {
      "country": "South Korea",
      "visits": 443
    }, {
      "country": "Canada",
      "visits": 441
    }, {
      "country": "Brazil",
      "visits": 395
    }, {
      "country": "Italy",
      "visits": 386
    }, {
      "country": "Taiwan",
      "visits": 338
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = "left";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;

    // Create series
    let series = chart.series.push(new am4charts.ConeSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";

    let columnTemplate = series.columns.template;
    columnTemplate.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    })

  }

  stacked3dChart() {

    // Create chart instance
    let chart = am4core.create("DesignationWiseVolunteersVsAssociates", am4charts.XYChart3D);

    // Add data
    chart.data = this.getDesignationWiseVolunteerVsAssociate();

    //  [{
    //  "country": "USA",
    //  "year2017": 3.5,
    //  "year2018": 4.2
    //}, {
    //  "country": "UK",
    //  "year2017": 1.7,
    //  "year2018": 3.1
    //}, {
    //  "country": "Canada",
    //  "year2017": 2.8,
    //  "year2018": 2.9
    //}, {
    //  "country": "Japan",
    //  "year2017": 2.6,
    //  "year2018": 2.3
    //}, {
    //  "country": "France",
    //  "year2017": 1.4,
    //  "year2018": 2.1
    //}, {
    //  "country": "Brazil",
    //  "year2017": 2.6,
    //  "year2018": 4.9
    //}, {
    //  "country": "Russia",
    //  "year2017": 6.4,
    //  "year2018": 7.2
    //}, {
    //  "country": "India",
    //  "year2017": 8,
    //  "year2018": 7.1
    //}, {
    //  "country": "China",
    //  "year2017": 9.9,
    //  "year2018": 10.1
    //}];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "designation";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Designation wise comparison";
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "volunteers";
    series.dataFields.categoryX = "designation";
    series.name = "Volunteers";
    series.clustered = false;
    series.columns.template.tooltipText = "Volunteers in {category}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.9;

    let series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.valueY = "associates";
    series2.dataFields.categoryX = "designation";
    series2.name = "Associates";
    series2.clustered = false;
    series2.columns.template.tooltipText = "Associates in {category}: [bold]{valueY}[/]";

  }

  layeredColumnChart(chartContainer: string) {

    // Create chart instance
    let chart = am4core.create(chartContainer, am4charts.XYChart);

    // Add percent sign to all numbers
   // chart.numberFormatter.numberFormat = "#.3'%'";

    let category: string;
    let titleText: string;
    if (chartContainer == "DesignationWiseVolunteersVsAssociates") {
      category = "designation";
      titleText = "Designation wise rate";
    } else if (chartContainer == "BuWiseVolunteersVsAssociates") {
      category = "businessUnit";
      titleText = "Business Unit wise rate";
    } else if (chartContainer == "LocationWiseVolunteersVsAssociates") {
      category = "baseLocation";
      titleText = "Base Location wise rate";
    }
    // Add data
    if (chartContainer == "DesignationWiseVolunteersVsAssociates")
      chart.data = this.getDesignationWiseVolunteerVsAssociate();
    else if (chartContainer == "BuWiseVolunteersVsAssociates")
      chart.data = this.getBuWiseVolunteerVsAssociate();
    else if (chartContainer == "LocationWiseVolunteersVsAssociates")
      chart.data = this.getLocationWiseVolunteerVsAssociate();

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = titleText;
    //valueAxis.title.fontWeight = 800;

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
      // //remove label
      // series.ticks.template.disabled = true;
      // series.alignLabels = false;
      // series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
      // series.labels.template.radius = am4core.percent(-40);
      // series.labels.template.fill = am4core.color("white");
    }


    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "associates";
    series.dataFields.categoryX = category;
    series.clustered = false;
    series.tooltipText = "Associates in {categoryX}: [bold]{valueY}[/]";

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "volunteers";
    series2.dataFields.categoryX = category;
    series2.clustered = false;
    series2.columns.template.width = am4core.percent(50);
    series2.tooltipText = "Volunteers in {categoryX}: [bold]{valueY}[/]";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

  }

  stackedColumnChart() {

    // Create chart instance
    let chart = am4core.create("chartdiv10", am4charts.XYChart);


    // Add data
    chart.data = [{
      "year": "2016",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 0.3,
      "meast": 0.2,
      "africa": 0.1
    }, {
      "year": "2017",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }, {
      "year": "2018",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.3,
      "africa": 0.1
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    function createSeries(field, name) {

      // Set up series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.sequencedInterpolation = true;

      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;

      return series;
    }

    createSeries("europe", "Europe");
    createSeries("namerica", "North America");
    createSeries("asia", "Asia-Pacific");
    createSeries("lamerica", "Latin America");
    createSeries("meast", "Middle-East");
    createSeries("africa", "Africa");

    // Legend
    chart.legend = new am4charts.Legend();

  }

  stackedAreaChart() {
    let chart = am4core.create("chartdiv11", am4charts.XYChart);

    chart.data = [{
      "year": "1994",
      "cars": 1587,
      "motorcycles": 650,
      "bicycles": 121
    }, {
      "year": "1995",
      "cars": 1567,
      "motorcycles": 683,
      "bicycles": 146
    }, {
      "year": "1996",
      "cars": 1617,
      "motorcycles": 691,
      "bicycles": 138
    }, {
      "year": "1997",
      "cars": 1630,
      "motorcycles": 642,
      "bicycles": 127
    }, {
      "year": "1998",
      "cars": 1660,
      "motorcycles": 699,
      "bicycles": 105
    }, {
      "year": "1999",
      "cars": 1683,
      "motorcycles": 721,
      "bicycles": 109
    }, {
      "year": "2000",
      "cars": 1691,
      "motorcycles": 737,
      "bicycles": 112
    }, {
      "year": "2001",
      "cars": 1298,
      "motorcycles": 680,
      "bicycles": 101
    }, {
      "year": "2002",
      "cars": 1275,
      "motorcycles": 664,
      "bicycles": 97
    }, {
      "year": "2003",
      "cars": 1246,
      "motorcycles": 648,
      "bicycles": 93
    }, {
      "year": "2004",
      "cars": 1318,
      "motorcycles": 697,
      "bicycles": 111
    }, {
      "year": "2005",
      "cars": 1213,
      "motorcycles": 633,
      "bicycles": 87
    }, {
      "year": "2006",
      "cars": 1199,
      "motorcycles": 621,
      "bicycles": 79
    }, {
      "year": "2007",
      "cars": 1110,
      "motorcycles": 210,
      "bicycles": 81
    }, {
      "year": "2008",
      "cars": 1165,
      "motorcycles": 232,
      "bicycles": 75
    }, {
      "year": "2009",
      "cars": 1145,
      "motorcycles": 219,
      "bicycles": 88
    }, {
      "year": "2010",
      "cars": 1163,
      "motorcycles": 201,
      "bicycles": 82
    }, {
      "year": "2011",
      "cars": 1180,
      "motorcycles": 285,
      "bicycles": 87
    }, {
      "year": "2012",
      "cars": 1159,
      "motorcycles": 277,
      "bicycles": 71
    }];

    chart.dateFormatter.inputDateFormat = "yyyy";
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.baseInterval = {
      timeUnit: "year",
      count: 1
    }

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "year";
    series.name = "cars";
    series.dataFields.valueY = "cars";
    series.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    series.tooltipText = "[#000]{valueY.value}[/]";
    series.tooltip.background.fill = am4core.color("#FFF");
    series.tooltip.getStrokeFromObject = true;
    series.tooltip.background.strokeWidth = 3;
    series.tooltip.getFillFromObject = false;
    series.fillOpacity = 0.6;
    series.strokeWidth = 2;
    series.stacked = true;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "motorcycles";
    series2.dataFields.dateX = "year";
    series2.dataFields.valueY = "motorcycles";
    series2.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/motorcycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    series2.tooltipText = "[#000]{valueY.value}[/]";
    series2.tooltip.background.fill = am4core.color("#FFF");
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.getStrokeFromObject = true;
    series2.tooltip.background.strokeWidth = 3;
    series2.sequencedInterpolation = true;
    series2.fillOpacity = 0.6;
    series2.stacked = true;
    series2.strokeWidth = 2;

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.name = "bicycles";
    series3.dataFields.dateX = "year";
    series3.dataFields.valueY = "bicycles";
    series3.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/bicycle.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    series3.tooltipText = "[#000]{valueY.value}[/]";
    series3.tooltip.background.fill = am4core.color("#FFF");
    series3.tooltip.getFillFromObject = false;
    series3.tooltip.getStrokeFromObject = true;
    series3.tooltip.background.strokeWidth = 3;
    series3.sequencedInterpolation = true;
    series3.fillOpacity = 0.6;
    series3.defaultState.transitionDuration = 1000;
    series3.stacked = true;
    series3.strokeWidth = 2;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";

    // axis ranges
    let range = dateAxis.axisRanges.create();
    range.date = new Date(2001, 1, 1);
    range.endDate = new Date(2003, 1, 1);
    range.axisFill.fill = chart.colors.getIndex(7);
    range.axisFill.fillOpacity = 0.2;

    range.label.text = "Fines for speeding increased";
    range.label.inside = true;
    range.label.rotation = 90;
    range.label.horizontalCenter = "right";
    range.label.verticalCenter = "bottom";

    let range2 = dateAxis.axisRanges.create();
    range2.date = new Date(2007, 1, 1);
    range2.grid.stroke = chart.colors.getIndex(7);
    range2.grid.strokeOpacity = 0.6;
    range2.grid.strokeDasharray = "5,2";


    range2.label.text = "Motorcycle fee introduced";
    range2.label.inside = true;
    range2.label.rotation = 90;
    range2.label.horizontalCenter = "right";
    range2.label.verticalCenter = "bottom";
  }

  columnLineMixChart() {
    // Create chart instance
    let chart = am4core.create("chartdiv12", am4charts.XYChart);

    // Export
    chart.exporting.menu = new am4core.ExportMenu();

    // Data for both series
    let data = [{
      "year": "2009",
      "income": 23.5,
      "expenses": 21.1
    }, {
      "year": "2010",
      "income": 26.2,
      "expenses": 30.5
    }, {
      "year": "2011",
      "income": 30.1,
      "expenses": 34.9
    }, {
      "year": "2012",
      "income": 29.5,
      "expenses": 31.1
    }, {
      "year": "2013",
      "income": 30.6,
      "expenses": 28.2,
      "lineDash": "5,5",
    }, {
      "year": "2014",
      "income": 34.1,
      "expenses": 32.9,
      "strokeWidth": 1,
      "columnDash": "5,5",
      "fillOpacity": 0.2,
      "additional": "(projection)"
    }];

    /* Create axes */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.minGridDistance = 30;

    /* Create value axis */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    /* Create series */
    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = "Income";
    columnSeries.dataFields.valueY = "income";
    columnSeries.dataFields.categoryX = "year";

    columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
    columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
    columnSeries.tooltip.label.textAlign = "middle";

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = "Expenses";
    lineSeries.dataFields.valueY = "expenses";
    lineSeries.dataFields.categoryX = "year";

    lineSeries.stroke = am4core.color("#fdd400");
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";

    let bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
    bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    let circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.fill = am4core.color("#fff");
    circle.strokeWidth = 3;

    chart.data = data;

  }

  clusteredBarChart() {

    // Create chart instance
    let chart = am4core.create("chartdiv13", am4charts.XYChart);

    // Add data
    chart.data = [{
      "year": 2005,
      "income": 23.5,
      "expenses": 18.1
    }, {
      "year": 2006,
      "income": 26.2,
      "expenses": 22.8
    }, {
      "year": 2007,
      "income": 30.1,
      "expenses": 23.9
    }, {
      "year": 2008,
      "income": 29.5,
      "expenses": 25.1
    }, {
      "year": 2009,
      "income": 24.6,
      "expenses": 25
    }];

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

    // Create series
    function createSeries(field, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
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

    createSeries("income", "Income");
    createSeries("expenses", "Expenses");
  }

  map() {
    // Create map instance
    let chart = am4core.create("chartdiv5", am4maps.MapChart);

    let title = chart.titles.create();
    title.text = "[bold font-size: 20]Population of the World in 2011[/]\nsource: Gapminder";
    title.textAlign = "middle";

    let latlong = {
      "AD": { "latitude": 42.5, "longitude": 1.5 },
      "AE": { "latitude": 24, "longitude": 54 },
      "AF": { "latitude": 33, "longitude": 65 },
      "AG": { "latitude": 17.05, "longitude": -61.8 },
      "AI": { "latitude": 18.25, "longitude": -63.1667 },
      "AL": { "latitude": 41, "longitude": 20 },
      "AM": { "latitude": 40, "longitude": 45 },
      "AN": { "latitude": 12.25, "longitude": -68.75 },
      "AO": { "latitude": -12.5, "longitude": 18.5 },
      "AP": { "latitude": 35, "longitude": 105 },
      "AQ": { "latitude": -90, "longitude": 0 },
      "AR": { "latitude": -34, "longitude": -64 },
      "AS": { "latitude": -14.3333, "longitude": -170 },
      "AT": { "latitude": 47.3333, "longitude": 13.3333 },
      "AU": { "latitude": -27, "longitude": 133 },
      "AW": { "latitude": 12.5, "longitude": -69.9667 },
      "AZ": { "latitude": 40.5, "longitude": 47.5 },
      "BA": { "latitude": 44, "longitude": 18 },
      "BB": { "latitude": 13.1667, "longitude": -59.5333 },
      "BD": { "latitude": 24, "longitude": 90 },
      "BE": { "latitude": 50.8333, "longitude": 4 },
      "BF": { "latitude": 13, "longitude": -2 },
      "BG": { "latitude": 43, "longitude": 25 },
      "BH": { "latitude": 26, "longitude": 50.55 },
      "BI": { "latitude": -3.5, "longitude": 30 },
      "BJ": { "latitude": 9.5, "longitude": 2.25 },
      "BM": { "latitude": 32.3333, "longitude": -64.75 },
      "BN": { "latitude": 4.5, "longitude": 114.6667 },
      "BO": { "latitude": -17, "longitude": -65 },
      "BR": { "latitude": -10, "longitude": -55 },
      "BS": { "latitude": 24.25, "longitude": -76 },
      "BT": { "latitude": 27.5, "longitude": 90.5 },
      "BV": { "latitude": -54.4333, "longitude": 3.4 },
      "BW": { "latitude": -22, "longitude": 24 },
      "BY": { "latitude": 53, "longitude": 28 },
      "BZ": { "latitude": 17.25, "longitude": -88.75 },
      "CA": { "latitude": 54, "longitude": -100 },
      "CC": { "latitude": -12.5, "longitude": 96.8333 },
      "CD": { "latitude": 0, "longitude": 25 },
      "CF": { "latitude": 7, "longitude": 21 },
      "CG": { "latitude": -1, "longitude": 15 },
      "CH": { "latitude": 47, "longitude": 8 },
      "CI": { "latitude": 8, "longitude": -5 },
      "CK": { "latitude": -21.2333, "longitude": -159.7667 },
      "CL": { "latitude": -30, "longitude": -71 },
      "CM": { "latitude": 6, "longitude": 12 },
      "CN": { "latitude": 35, "longitude": 105 },
      "CO": { "latitude": 4, "longitude": -72 },
      "CR": { "latitude": 10, "longitude": -84 },
      "CU": { "latitude": 21.5, "longitude": -80 },
      "CV": { "latitude": 16, "longitude": -24 },
      "CX": { "latitude": -10.5, "longitude": 105.6667 },
      "CY": { "latitude": 35, "longitude": 33 },
      "CZ": { "latitude": 49.75, "longitude": 15.5 },
      "DE": { "latitude": 51, "longitude": 9 },
      "DJ": { "latitude": 11.5, "longitude": 43 },
      "DK": { "latitude": 56, "longitude": 10 },
      "DM": { "latitude": 15.4167, "longitude": -61.3333 },
      "DO": { "latitude": 19, "longitude": -70.6667 },
      "DZ": { "latitude": 28, "longitude": 3 },
      "EC": { "latitude": -2, "longitude": -77.5 },
      "EE": { "latitude": 59, "longitude": 26 },
      "EG": { "latitude": 27, "longitude": 30 },
      "EH": { "latitude": 24.5, "longitude": -13 },
      "ER": { "latitude": 15, "longitude": 39 },
      "ES": { "latitude": 40, "longitude": -4 },
      "ET": { "latitude": 8, "longitude": 38 },
      "EU": { "latitude": 47, "longitude": 8 },
      "FI": { "latitude": 62, "longitude": 26 },
      "FJ": { "latitude": -18, "longitude": 175 },
      "FK": { "latitude": -51.75, "longitude": -59 },
      "FM": { "latitude": 6.9167, "longitude": 158.25 },
      "FO": { "latitude": 62, "longitude": -7 },
      "FR": { "latitude": 46, "longitude": 2 },
      "GA": { "latitude": -1, "longitude": 11.75 },
      "GB": { "latitude": 54, "longitude": -2 },
      "GD": { "latitude": 12.1167, "longitude": -61.6667 },
      "GE": { "latitude": 42, "longitude": 43.5 },
      "GF": { "latitude": 4, "longitude": -53 },
      "GH": { "latitude": 8, "longitude": -2 },
      "GI": { "latitude": 36.1833, "longitude": -5.3667 },
      "GL": { "latitude": 72, "longitude": -40 },
      "GM": { "latitude": 13.4667, "longitude": -16.5667 },
      "GN": { "latitude": 11, "longitude": -10 },
      "GP": { "latitude": 16.25, "longitude": -61.5833 },
      "GQ": { "latitude": 2, "longitude": 10 },
      "GR": { "latitude": 39, "longitude": 22 },
      "GS": { "latitude": -54.5, "longitude": -37 },
      "GT": { "latitude": 15.5, "longitude": -90.25 },
      "GU": { "latitude": 13.4667, "longitude": 144.7833 },
      "GW": { "latitude": 12, "longitude": -15 },
      "GY": { "latitude": 5, "longitude": -59 },
      "HK": { "latitude": 22.25, "longitude": 114.1667 },
      "HM": { "latitude": -53.1, "longitude": 72.5167 },
      "HN": { "latitude": 15, "longitude": -86.5 },
      "HR": { "latitude": 45.1667, "longitude": 15.5 },
      "HT": { "latitude": 19, "longitude": -72.4167 },
      "HU": { "latitude": 47, "longitude": 20 },
      "ID": { "latitude": -5, "longitude": 120 },
      "IE": { "latitude": 53, "longitude": -8 },
      "IL": { "latitude": 31.5, "longitude": 34.75 },
      "IN": { "latitude": 20, "longitude": 77 },
      "IO": { "latitude": -6, "longitude": 71.5 },
      "IQ": { "latitude": 33, "longitude": 44 },
      "IR": { "latitude": 32, "longitude": 53 },
      "IS": { "latitude": 65, "longitude": -18 },
      "IT": { "latitude": 42.8333, "longitude": 12.8333 },
      "JM": { "latitude": 18.25, "longitude": -77.5 },
      "JO": { "latitude": 31, "longitude": 36 },
      "JP": { "latitude": 36, "longitude": 138 },
      "KE": { "latitude": 1, "longitude": 38 },
      "KG": { "latitude": 41, "longitude": 75 },
      "KH": { "latitude": 13, "longitude": 105 },
      "KI": { "latitude": 1.4167, "longitude": 173 },
      "KM": { "latitude": -12.1667, "longitude": 44.25 },
      "KN": { "latitude": 17.3333, "longitude": -62.75 },
      "KP": { "latitude": 40, "longitude": 127 },
      "KR": { "latitude": 37, "longitude": 127.5 },
      "KW": { "latitude": 29.3375, "longitude": 47.6581 },
      "KY": { "latitude": 19.5, "longitude": -80.5 },
      "KZ": { "latitude": 48, "longitude": 68 },
      "LA": { "latitude": 18, "longitude": 105 },
      "LB": { "latitude": 33.8333, "longitude": 35.8333 },
      "LC": { "latitude": 13.8833, "longitude": -61.1333 },
      "LI": { "latitude": 47.1667, "longitude": 9.5333 },
      "LK": { "latitude": 7, "longitude": 81 },
      "LR": { "latitude": 6.5, "longitude": -9.5 },
      "LS": { "latitude": -29.5, "longitude": 28.5 },
      "LT": { "latitude": 55, "longitude": 24 },
      "LU": { "latitude": 49.75, "longitude": 6 },
      "LV": { "latitude": 57, "longitude": 25 },
      "LY": { "latitude": 25, "longitude": 17 },
      "MA": { "latitude": 32, "longitude": -5 },
      "MC": { "latitude": 43.7333, "longitude": 7.4 },
      "MD": { "latitude": 47, "longitude": 29 },
      "ME": { "latitude": 42.5, "longitude": 19.4 },
      "MG": { "latitude": -20, "longitude": 47 },
      "MH": { "latitude": 9, "longitude": 168 },
      "MK": { "latitude": 41.8333, "longitude": 22 },
      "ML": { "latitude": 17, "longitude": -4 },
      "MM": { "latitude": 22, "longitude": 98 },
      "MN": { "latitude": 46, "longitude": 105 },
      "MO": { "latitude": 22.1667, "longitude": 113.55 },
      "MP": { "latitude": 15.2, "longitude": 145.75 },
      "MQ": { "latitude": 14.6667, "longitude": -61 },
      "MR": { "latitude": 20, "longitude": -12 },
      "MS": { "latitude": 16.75, "longitude": -62.2 },
      "MT": { "latitude": 35.8333, "longitude": 14.5833 },
      "MU": { "latitude": -20.2833, "longitude": 57.55 },
      "MV": { "latitude": 3.25, "longitude": 73 },
      "MW": { "latitude": -13.5, "longitude": 34 },
      "MX": { "latitude": 23, "longitude": -102 },
      "MY": { "latitude": 2.5, "longitude": 112.5 },
      "MZ": { "latitude": -18.25, "longitude": 35 },
      "NA": { "latitude": -22, "longitude": 17 },
      "NC": { "latitude": -21.5, "longitude": 165.5 },
      "NE": { "latitude": 16, "longitude": 8 },
      "NF": { "latitude": -29.0333, "longitude": 167.95 },
      "NG": { "latitude": 10, "longitude": 8 },
      "NI": { "latitude": 13, "longitude": -85 },
      "NL": { "latitude": 52.5, "longitude": 5.75 },
      "NO": { "latitude": 62, "longitude": 10 },
      "NP": { "latitude": 28, "longitude": 84 },
      "NR": { "latitude": -0.5333, "longitude": 166.9167 },
      "NU": { "latitude": -19.0333, "longitude": -169.8667 },
      "NZ": { "latitude": -41, "longitude": 174 },
      "OM": { "latitude": 21, "longitude": 57 },
      "PA": { "latitude": 9, "longitude": -80 },
      "PE": { "latitude": -10, "longitude": -76 },
      "PF": { "latitude": -15, "longitude": -140 },
      "PG": { "latitude": -6, "longitude": 147 },
      "PH": { "latitude": 13, "longitude": 122 },
      "PK": { "latitude": 30, "longitude": 70 },
      "PL": { "latitude": 52, "longitude": 20 },
      "PM": { "latitude": 46.8333, "longitude": -56.3333 },
      "PR": { "latitude": 18.25, "longitude": -66.5 },
      "PS": { "latitude": 32, "longitude": 35.25 },
      "PT": { "latitude": 39.5, "longitude": -8 },
      "PW": { "latitude": 7.5, "longitude": 134.5 },
      "PY": { "latitude": -23, "longitude": -58 },
      "QA": { "latitude": 25.5, "longitude": 51.25 },
      "RE": { "latitude": -21.1, "longitude": 55.6 },
      "RO": { "latitude": 46, "longitude": 25 },
      "RS": { "latitude": 44, "longitude": 21 },
      "RU": { "latitude": 60, "longitude": 100 },
      "RW": { "latitude": -2, "longitude": 30 },
      "SA": { "latitude": 25, "longitude": 45 },
      "SB": { "latitude": -8, "longitude": 159 },
      "SC": { "latitude": -4.5833, "longitude": 55.6667 },
      "SD": { "latitude": 15, "longitude": 30 },
      "SE": { "latitude": 62, "longitude": 15 },
      "SG": { "latitude": 1.3667, "longitude": 103.8 },
      "SH": { "latitude": -15.9333, "longitude": -5.7 },
      "SI": { "latitude": 46, "longitude": 15 },
      "SJ": { "latitude": 78, "longitude": 20 },
      "SK": { "latitude": 48.6667, "longitude": 19.5 },
      "SL": { "latitude": 8.5, "longitude": -11.5 },
      "SM": { "latitude": 43.7667, "longitude": 12.4167 },
      "SN": { "latitude": 14, "longitude": -14 },
      "SO": { "latitude": 10, "longitude": 49 },
      "SR": { "latitude": 4, "longitude": -56 },
      "ST": { "latitude": 1, "longitude": 7 },
      "SV": { "latitude": 13.8333, "longitude": -88.9167 },
      "SY": { "latitude": 35, "longitude": 38 },
      "SZ": { "latitude": -26.5, "longitude": 31.5 },
      "TC": { "latitude": 21.75, "longitude": -71.5833 },
      "TD": { "latitude": 15, "longitude": 19 },
      "TF": { "latitude": -43, "longitude": 67 },
      "TG": { "latitude": 8, "longitude": 1.1667 },
      "TH": { "latitude": 15, "longitude": 100 },
      "TJ": { "latitude": 39, "longitude": 71 },
      "TK": { "latitude": -9, "longitude": -172 },
      "TM": { "latitude": 40, "longitude": 60 },
      "TN": { "latitude": 34, "longitude": 9 },
      "TO": { "latitude": -20, "longitude": -175 },
      "TR": { "latitude": 39, "longitude": 35 },
      "TT": { "latitude": 11, "longitude": -61 },
      "TV": { "latitude": -8, "longitude": 178 },
      "TW": { "latitude": 23.5, "longitude": 121 },
      "TZ": { "latitude": -6, "longitude": 35 },
      "UA": { "latitude": 49, "longitude": 32 },
      "UG": { "latitude": 1, "longitude": 32 },
      "UM": { "latitude": 19.2833, "longitude": 166.6 },
      "US": { "latitude": 38, "longitude": -97 },
      "UY": { "latitude": -33, "longitude": -56 },
      "UZ": { "latitude": 41, "longitude": 64 },
      "VA": { "latitude": 41.9, "longitude": 12.45 },
      "VC": { "latitude": 13.25, "longitude": -61.2 },
      "VE": { "latitude": 8, "longitude": -66 },
      "VG": { "latitude": 18.5, "longitude": -64.5 },
      "VI": { "latitude": 18.3333, "longitude": -64.8333 },
      "VN": { "latitude": 16, "longitude": 106 },
      "VU": { "latitude": -16, "longitude": 167 },
      "WF": { "latitude": -13.3, "longitude": -176.2 },
      "WS": { "latitude": -13.5833, "longitude": -172.3333 },
      "YE": { "latitude": 15, "longitude": 48 },
      "YT": { "latitude": -12.8333, "longitude": 45.1667 },
      "ZA": { "latitude": -29, "longitude": 24 },
      "ZM": { "latitude": -15, "longitude": 30 },
      "ZW": { "latitude": -20, "longitude": 30 }
    };

    let mapData = [
      { "id": "AF", "name": "Afghanistan", "value": 32358260, "color": chart.colors.getIndex(0) },
      { "id": "AL", "name": "Albania", "value": 3215988, "color": chart.colors.getIndex(1) },
      { "id": "DZ", "name": "Algeria", "value": 35980193, "color": chart.colors.getIndex(2) },
      { "id": "AO", "name": "Angola", "value": 19618432, "color": chart.colors.getIndex(2) },
      { "id": "AR", "name": "Argentina", "value": 40764561, "color": chart.colors.getIndex(3) },
      { "id": "AM", "name": "Armenia", "value": 3100236, "color": chart.colors.getIndex(1) },
      { "id": "AU", "name": "Australia", "value": 22605732, "color": "#8aabb0" },
      { "id": "AT", "name": "Austria", "value": 8413429, "color": chart.colors.getIndex(1) },
      { "id": "AZ", "name": "Azerbaijan", "value": 9306023, "color": chart.colors.getIndex(1) },
      { "id": "BH", "name": "Bahrain", "value": 1323535, "color": chart.colors.getIndex(0) },
      { "id": "BD", "name": "Bangladesh", "value": 150493658, "color": chart.colors.getIndex(0) },
      { "id": "BY", "name": "Belarus", "value": 9559441, "color": chart.colors.getIndex(1) },
      { "id": "BE", "name": "Belgium", "value": 10754056, "color": chart.colors.getIndex(1) },
      { "id": "BJ", "name": "Benin", "value": 9099922, "color": chart.colors.getIndex(2) },
      { "id": "BT", "name": "Bhutan", "value": 738267, "color": chart.colors.getIndex(0) },
      { "id": "BO", "name": "Bolivia", "value": 10088108, "color": chart.colors.getIndex(3) },
      { "id": "BA", "name": "Bosnia and Herzegovina", "value": 3752228, "color": chart.colors.getIndex(1) },
      { "id": "BW", "name": "Botswana", "value": 2030738, "color": chart.colors.getIndex(2) },
      { "id": "BR", "name": "Brazil", "value": 196655014, "color": chart.colors.getIndex(3) },
      { "id": "BN", "name": "Brunei", "value": 405938, "color": chart.colors.getIndex(0) },
      { "id": "BG", "name": "Bulgaria", "value": 7446135, "color": chart.colors.getIndex(1) },
      { "id": "BF", "name": "Burkina Faso", "value": 16967845, "color": chart.colors.getIndex(2) },
      { "id": "BI", "name": "Burundi", "value": 8575172, "color": chart.colors.getIndex(2) },
      { "id": "KH", "name": "Cambodia", "value": 14305183, "color": chart.colors.getIndex(0) },
      { "id": "CM", "name": "Cameroon", "value": 20030362, "color": chart.colors.getIndex(2) },
      { "id": "CA", "name": "Canada", "value": 34349561, "color": chart.colors.getIndex(4) },
      { "id": "CV", "name": "Cape Verde", "value": 500585, "color": chart.colors.getIndex(2) },
      { "id": "CF", "name": "Central African Rep.", "value": 4486837, "color": chart.colors.getIndex(2) },
      { "id": "TD", "name": "Chad", "value": 11525496, "color": chart.colors.getIndex(2) },
      { "id": "CL", "name": "Chile", "value": 17269525, "color": chart.colors.getIndex(3) },
      { "id": "CN", "name": "China", "value": 1347565324, "color": chart.colors.getIndex(0) },
      { "id": "CO", "name": "Colombia", "value": 46927125, "color": chart.colors.getIndex(3) },
      { "id": "KM", "name": "Comoros", "value": 753943, "color": chart.colors.getIndex(2) },
      { "id": "CD", "name": "Congo, Dem. Rep.", "value": 67757577, "color": chart.colors.getIndex(2) },
      { "id": "CG", "name": "Congo, Rep.", "value": 4139748, "color": chart.colors.getIndex(2) },
      { "id": "CR", "name": "Costa Rica", "value": 4726575, "color": chart.colors.getIndex(4) },
      { "id": "CI", "name": "Cote d'Ivoire", "value": 20152894, "color": chart.colors.getIndex(2) },
      { "id": "HR", "name": "Croatia", "value": 4395560, "color": chart.colors.getIndex(1) },
      { "id": "CU", "name": "Cuba", "value": 11253665, "color": chart.colors.getIndex(4) },
      { "id": "CY", "name": "Cyprus", "value": 1116564, "color": chart.colors.getIndex(1) },
      { "id": "CZ", "name": "Czech Rep.", "value": 10534293, "color": chart.colors.getIndex(1) },
      { "id": "DK", "name": "Denmark", "value": 5572594, "color": chart.colors.getIndex(1) },
      { "id": "DJ", "name": "Djibouti", "value": 905564, "color": chart.colors.getIndex(2) },
      { "id": "DO", "name": "Dominican Rep.", "value": 10056181, "color": chart.colors.getIndex(4) },
      { "id": "EC", "name": "Ecuador", "value": 14666055, "color": chart.colors.getIndex(3) },
      { "id": "EG", "name": "Egypt", "value": 82536770, "color": chart.colors.getIndex(2) },
      { "id": "SV", "name": "El Salvador", "value": 6227491, "color": chart.colors.getIndex(4) },
      { "id": "GQ", "name": "Equatorial Guinea", "value": 720213, "color": chart.colors.getIndex(2) },
      { "id": "ER", "name": "Eritrea", "value": 5415280, "color": chart.colors.getIndex(2) },
      { "id": "EE", "name": "Estonia", "value": 1340537, "color": chart.colors.getIndex(1) },
      { "id": "ET", "name": "Ethiopia", "value": 84734262, "color": chart.colors.getIndex(2) },
      { "id": "FJ", "name": "Fiji", "value": 868406, "color": "#8aabb0" },
      { "id": "FI", "name": "Finland", "value": 5384770, "color": chart.colors.getIndex(1) },
      { "id": "FR", "name": "France", "value": 63125894, "color": chart.colors.getIndex(1) },
      { "id": "GA", "name": "Gabon", "value": 1534262, "color": chart.colors.getIndex(2) },
      { "id": "GM", "name": "Gambia", "value": 1776103, "color": chart.colors.getIndex(2) },
      { "id": "GE", "name": "Georgia", "value": 4329026, "color": chart.colors.getIndex(1) },
      { "id": "DE", "name": "Germany", "value": 82162512, "color": chart.colors.getIndex(1) },
      { "id": "GH", "name": "Ghana", "value": 24965816, "color": chart.colors.getIndex(2) },
      { "id": "GR", "name": "Greece", "value": 11390031, "color": chart.colors.getIndex(1) },
      { "id": "GT", "name": "Guatemala", "value": 14757316, "color": chart.colors.getIndex(4) },
      { "id": "GN", "name": "Guinea", "value": 10221808, "color": chart.colors.getIndex(2) },
      { "id": "GW", "name": "Guinea-Bissau", "value": 1547061, "color": chart.colors.getIndex(2) },
      { "id": "GY", "name": "Guyana", "value": 756040, "color": chart.colors.getIndex(3) },
      { "id": "HT", "name": "Haiti", "value": 10123787, "color": chart.colors.getIndex(4) },
      { "id": "HN", "name": "Honduras", "value": 7754687, "color": chart.colors.getIndex(4) },
      { "id": "HK", "name": "Hong Kong, China", "value": 7122187, "color": chart.colors.getIndex(0) },
      { "id": "HU", "name": "Hungary", "value": 9966116, "color": chart.colors.getIndex(1) },
      { "id": "IS", "name": "Iceland", "value": 324366, "color": chart.colors.getIndex(1) },
      { "id": "IN", "name": "India", "value": 1241491960, "color": chart.colors.getIndex(0) },
      { "id": "ID", "name": "Indonesia", "value": 242325638, "color": chart.colors.getIndex(0) },
      { "id": "IR", "name": "Iran", "value": 74798599, "color": chart.colors.getIndex(0) },
      { "id": "IQ", "name": "Iraq", "value": 32664942, "color": chart.colors.getIndex(0) },
      { "id": "IE", "name": "Ireland", "value": 4525802, "color": chart.colors.getIndex(1) },
      { "id": "IL", "name": "Israel", "value": 7562194, "color": chart.colors.getIndex(0) },
      { "id": "IT", "name": "Italy", "value": 60788694, "color": chart.colors.getIndex(1) },
      { "id": "JM", "name": "Jamaica", "value": 2751273, "color": chart.colors.getIndex(4) },
      { "id": "JP", "name": "Japan", "value": 126497241, "color": chart.colors.getIndex(0) },
      { "id": "JO", "name": "Jordan", "value": 6330169, "color": chart.colors.getIndex(0) },
      { "id": "KZ", "name": "Kazakhstan", "value": 16206750, "color": chart.colors.getIndex(0) },
      { "id": "KE", "name": "Kenya", "value": 41609728, "color": chart.colors.getIndex(2) },
      { "id": "KP", "name": "Korea, Dem. Rep.", "value": 24451285, "color": chart.colors.getIndex(0) },
      { "id": "KR", "name": "Korea, Rep.", "value": 48391343, "color": chart.colors.getIndex(0) },
      { "id": "KW", "name": "Kuwait", "value": 2818042, "color": chart.colors.getIndex(0) },
      { "id": "KG", "name": "Kyrgyzstan", "value": 5392580, "color": chart.colors.getIndex(0) },
      { "id": "LA", "name": "Laos", "value": 6288037, "color": chart.colors.getIndex(0) },
      { "id": "LV", "name": "Latvia", "value": 2243142, "color": chart.colors.getIndex(1) },
      { "id": "LB", "name": "Lebanon", "value": 4259405, "color": chart.colors.getIndex(0) },
      { "id": "LS", "name": "Lesotho", "value": 2193843, "color": chart.colors.getIndex(2) },
      { "id": "LR", "name": "Liberia", "value": 4128572, "color": chart.colors.getIndex(2) },
      { "id": "LY", "name": "Libya", "value": 6422772, "color": chart.colors.getIndex(2) },
      { "id": "LT", "name": "Lithuania", "value": 3307481, "color": chart.colors.getIndex(1) },
      { "id": "LU", "name": "Luxembourg", "value": 515941, "color": chart.colors.getIndex(1) },
      { "id": "MK", "name": "Macedonia, FYR", "value": 2063893, "color": chart.colors.getIndex(1) },
      { "id": "MG", "name": "Madagascar", "value": 21315135, "color": chart.colors.getIndex(2) },
      { "id": "MW", "name": "Malawi", "value": 15380888, "color": chart.colors.getIndex(2) },
      { "id": "MY", "name": "Malaysia", "value": 28859154, "color": chart.colors.getIndex(0) },
      { "id": "ML", "name": "Mali", "value": 15839538, "color": chart.colors.getIndex(2) },
      { "id": "MR", "name": "Mauritania", "value": 3541540, "color": chart.colors.getIndex(2) },
      { "id": "MU", "name": "Mauritius", "value": 1306593, "color": chart.colors.getIndex(2) },
      { "id": "MX", "name": "Mexico", "value": 114793341, "color": chart.colors.getIndex(4) },
      { "id": "MD", "name": "Moldova", "value": 3544864, "color": chart.colors.getIndex(1) },
      { "id": "MN", "name": "Mongolia", "value": 2800114, "color": chart.colors.getIndex(0) },
      { "id": "ME", "name": "Montenegro", "value": 632261, "color": chart.colors.getIndex(1) },
      { "id": "MA", "name": "Morocco", "value": 32272974, "color": chart.colors.getIndex(2) },
      { "id": "MZ", "name": "Mozambique", "value": 23929708, "color": chart.colors.getIndex(2) },
      { "id": "MM", "name": "Myanmar", "value": 48336763, "color": chart.colors.getIndex(0) },
      { "id": "NA", "name": "Namibia", "value": 2324004, "color": chart.colors.getIndex(2) },
      { "id": "NP", "name": "Nepal", "value": 30485798, "color": chart.colors.getIndex(0) },
      { "id": "NL", "name": "Netherlands", "value": 16664746, "color": chart.colors.getIndex(1) },
      { "id": "NZ", "name": "New Zealand", "value": 4414509, "color": "#8aabb0" },
      { "id": "NI", "name": "Nicaragua", "value": 5869859, "color": chart.colors.getIndex(4) },
      { "id": "NE", "name": "Niger", "value": 16068994, "color": chart.colors.getIndex(2) },
      { "id": "NG", "name": "Nigeria", "value": 162470737, "color": chart.colors.getIndex(2) },
      { "id": "NO", "name": "Norway", "value": 4924848, "color": chart.colors.getIndex(1) },
      { "id": "OM", "name": "Oman", "value": 2846145, "color": chart.colors.getIndex(0) },
      { "id": "PK", "name": "Pakistan", "value": 176745364, "color": chart.colors.getIndex(0) },
      { "id": "PA", "name": "Panama", "value": 3571185, "color": chart.colors.getIndex(4) },
      { "id": "PG", "name": "Papua New Guinea", "value": 7013829, "color": "#8aabb0" },
      { "id": "PY", "name": "Paraguay", "value": 6568290, "color": chart.colors.getIndex(3) },
      { "id": "PE", "name": "Peru", "value": 29399817, "color": chart.colors.getIndex(3) },
      { "id": "PH", "name": "Philippines", "value": 94852030, "color": chart.colors.getIndex(0) },
      { "id": "PL", "name": "Poland", "value": 38298949, "color": chart.colors.getIndex(1) },
      { "id": "PT", "name": "Portugal", "value": 10689663, "color": chart.colors.getIndex(1) },
      { "id": "PR", "name": "Puerto Rico", "value": 3745526, "color": chart.colors.getIndex(4) },
      { "id": "QA", "name": "Qatar", "value": 1870041, "color": chart.colors.getIndex(0) },
      { "id": "RO", "name": "Romania", "value": 21436495, "color": chart.colors.getIndex(1) },
      { "id": "RU", "name": "Russia", "value": 142835555, "color": chart.colors.getIndex(1) },
      { "id": "RW", "name": "Rwanda", "value": 10942950, "color": chart.colors.getIndex(2) },
      { "id": "SA", "name": "Saudi Arabia", "value": 28082541, "color": chart.colors.getIndex(0) },
      { "id": "SN", "name": "Senegal", "value": 12767556, "color": chart.colors.getIndex(2) },
      { "id": "RS", "name": "Serbia", "value": 9853969, "color": chart.colors.getIndex(1) },
      { "id": "SL", "name": "Sierra Leone", "value": 5997486, "color": chart.colors.getIndex(2) },
      { "id": "SG", "name": "Singapore", "value": 5187933, "color": chart.colors.getIndex(0) },
      { "id": "SK", "name": "Slovak Republic", "value": 5471502, "color": chart.colors.getIndex(1) },
      { "id": "SI", "name": "Slovenia", "value": 2035012, "color": chart.colors.getIndex(1) },
      { "id": "SB", "name": "Solomon Islands", "value": 552267, "color": "#8aabb0" },
      { "id": "SO", "name": "Somalia", "value": 9556873, "color": chart.colors.getIndex(2) },
      { "id": "ZA", "name": "South Africa", "value": 50459978, "color": chart.colors.getIndex(2) },
      { "id": "ES", "name": "Spain", "value": 46454895, "color": chart.colors.getIndex(1) },
      { "id": "LK", "name": "Sri Lanka", "value": 21045394, "color": chart.colors.getIndex(0) },
      { "id": "SD", "name": "Sudan", "value": 34735288, "color": chart.colors.getIndex(2) },
      { "id": "SR", "name": "Suriname", "value": 529419, "color": chart.colors.getIndex(3) },
      { "id": "SZ", "name": "Swaziland", "value": 1203330, "color": chart.colors.getIndex(2) },
      { "id": "SE", "name": "Sweden", "value": 9440747, "color": chart.colors.getIndex(1) },
      { "id": "CH", "name": "Switzerland", "value": 7701690, "color": chart.colors.getIndex(1) },
      { "id": "SY", "name": "Syria", "value": 20766037, "color": chart.colors.getIndex(0) },
      { "id": "TW", "name": "Taiwan", "value": 23072000, "color": chart.colors.getIndex(0) },
      { "id": "TJ", "name": "Tajikistan", "value": 6976958, "color": chart.colors.getIndex(0) },
      { "id": "TZ", "name": "Tanzania", "value": 46218486, "color": chart.colors.getIndex(2) },
      { "id": "TH", "name": "Thailand", "value": 69518555, "color": chart.colors.getIndex(0) },
      { "id": "TG", "name": "Togo", "value": 6154813, "color": chart.colors.getIndex(2) },
      { "id": "TT", "name": "Trinidad and Tobago", "value": 1346350, "color": chart.colors.getIndex(4) },
      { "id": "TN", "name": "Tunisia", "value": 10594057, "color": chart.colors.getIndex(2) },
      { "id": "TR", "name": "Turkey", "value": 73639596, "color": chart.colors.getIndex(1) },
      { "id": "TM", "name": "Turkmenistan", "value": 5105301, "color": chart.colors.getIndex(0) },
      { "id": "UG", "name": "Uganda", "value": 34509205, "color": chart.colors.getIndex(2) },
      { "id": "UA", "name": "Ukraine", "value": 45190180, "color": chart.colors.getIndex(1) },
      { "id": "AE", "name": "United Arab Emirates", "value": 7890924, "color": chart.colors.getIndex(0) },
      { "id": "GB", "name": "United Kingdom", "value": 62417431, "color": chart.colors.getIndex(1) },
      { "id": "US", "name": "United States", "value": 313085380, "color": chart.colors.getIndex(4) },
      { "id": "UY", "name": "Uruguay", "value": 3380008, "color": chart.colors.getIndex(3) },
      { "id": "UZ", "name": "Uzbekistan", "value": 27760267, "color": chart.colors.getIndex(0) },
      { "id": "VE", "name": "Venezuela", "value": 29436891, "color": chart.colors.getIndex(3) },
      { "id": "PS", "name": "West Bank and Gaza", "value": 4152369, "color": chart.colors.getIndex(0) },
      { "id": "VN", "name": "Vietnam", "value": 88791996, "color": chart.colors.getIndex(0) },
      { "id": "YE", "name": "Yemen, Rep.", "value": 24799880, "color": chart.colors.getIndex(0) },
      { "id": "ZM", "name": "Zambia", "value": 13474959, "color": chart.colors.getIndex(2) },
      { "id": "ZW", "name": "Zimbabwe", "value": 12754378, "color": chart.colors.getIndex(2) }
    ];

    // Add lat/long information to data
    // for(var i = 0; i < mapData.length; i++) {
    //   mapData[i].latitude = latlong[mapData[i].id].latitude;
    //   mapData[i].longitude = latlong[mapData[i].id].longitude;
    // }

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;

    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = mapData;
    imageSeries.dataFields.value = "value";

    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.propertyFields.latitude = "latitude";
    imageTemplate.propertyFields.longitude = "longitude";
    imageTemplate.nonScaling = true

    let circle = imageTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    circle.tooltipText = "{name}: [bold]{value}[/]";

    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })

  }
}

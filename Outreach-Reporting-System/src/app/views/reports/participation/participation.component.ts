import { Component, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { OnInit } from '@angular/core';
import { ParticipationService } from '../../../services/participation.service';

import { HostListener } from '@angular/core';

import { Event } from '../../../models/event.model';
import { Associate } from '../../../models/associate.model';
import { Enrollment } from '../../../models/enrollment.model';

am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'participation.component.html'
})
export class ParticipationComponent implements OnInit {

  private chart: am4charts.XYChart;
  public innerWidth: any;

  showReport: boolean = false;
 // isLoading: boolean = false;
  showDesignationData: boolean = false;
  allAssociates: Associate[] = [];
  allEvents: Event[] = [];
  allEnrollments: Enrollment[] = [];
  allVolunteers: any[] = [];
  allUniqueVolunteers: Associate[] = [];

  totalVolunteerHours: number;
  totalTravelHours: number;
  totalVolunteeringHours: number;

  totalAssociatesCount: number;
  totalVolunteersCount: number;
  uniqueVolunteersCount: number;

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
   
    //this.getAllAssociates();
    //this.getEnrollmentsByFilter();
    this.innerWidth = window.innerWidth;

  }

  onDataFiltered(data) {    
    this.allEnrollments = data;
    this.showReport = true;
    this.getAssociates();
    
  }

  getAssociates() {
    this.participationService.getAllAssociates().subscribe(data => {     
      this.allAssociates = data;
      this.totalAssociatesCount = data.length;
      this.metricCalculate();
      this.getDesignationWiseAssociates();
      this.getDesignationWiseVolunteers();
      this.getBUWiseAssociates();
      this.getBUWiseVolunteers();
      this.getBaseLocationWiseAssociates();
      this.getBaseLocationWiseVolunteers();
    
      this.showCharts();
      
      
    });
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

  //getAllAssociates() {
  //  this.participationService.getAllAssociates().subscribe(data => {
  //    this.allAssociates = data;
  //    this.totalAssociatesCount = data.length;
  //    this.getAllEvents();
  //  });
  //}
  //getAllEvents() {
  //  this.participationService.getAllEvents().subscribe(data => {
  //    this.allEvents = data;
  //    this.getEnrollments();
  //  });
  //}
  //getEnrollments() {
  //  this.participationService.getEnrollments().subscribe(data => {
  //    this.allEnrollments = data;

  //    this.getVolunteers();
  //  });
  //}

  //getVolunteers() {
  //  this.participationService.getUniqueVolunteers().subscribe(data => {
  //    this.allUniqueVolunteers = data;

  //    this.metricCalculate();
  //    this.getAllChartData();
  //  });
  //}
  
  //joinRecords(){
  //  this.allVolunteers =[];
  //this.allEnrollments.map((enrollment)=>{
  //  let associate = this.allAssociates.find((en)=> enrollment.associateID === en.id);
  //  //let event = this.allEvents.find((ev)=> enrollment.eventID === ev.id);
  //  if(associate)
  //  this.allVolunteers.push(Object.assign(enrollment, associate));
  //   //Object.assign(a,obj2);
  //  //return a;
  // });
  // console.log('combinedResult');
  // console.log(this.allVolunteers);
  //  this.metricCalculate();
  //    this.getAllChartData();
  //}

  //getAllChartData(){
  //  this.getDesignationWiseAssociates();
  //  this.getDesignationWiseVolunteers();
  //  this.getBUWiseAssociates();
  //  this.getBUWiseVolunteers();
  //  this.getBaseLocationWiseAssociates();
  //  this.getBaseLocationWiseVolunteers();
  // // this.getCountryWiseAssociates();
  //  //this.getCountryWiseVolunteers();
  //  this.showCharts();
  //}

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
    this.allVolunteers = this.allEnrollments.map(m => m.associates)
    this.allUniqueVolunteers = this.getUnique(this.allVolunteers, 'id');
    this.allEvents = this.getUnique(this.allEnrollments.map(m => m.events), 'id');
  }

  metricCalculate() {
    this.filterAssociatesFromEnrollments();
    this.totalAssociatesCount = this.allAssociates.length;
    this.totalVolunteersCount = this.allEnrollments.length;
    this.uniqueVolunteersCount = this.allUniqueVolunteers.length;

    let total: number = 0;
    let total1: number = 0;
    let totalVolunteers: number = 0;
    this.totalTravelHours = 0;
    this.totalVolunteerHours = 0;
    let weekdayHours = 0;
    let weekendHours = 0;
    let weekdayCount = 0;
    let weekendCount = 0;

    this.allEnrollments.forEach(enrollment => {

      this.totalTravelHours = this.totalTravelHours + enrollment.events.totalTravelHours;
      this.totalVolunteerHours = this.totalVolunteerHours + enrollment.events.totalVolunteerHours;
      total = total + enrollment.events.totalTravelHours + enrollment.events.totalVolunteerHours;
      total1 = 0;
      let d = new Date(enrollment.eventDate);
      let n = d.getDay();
      if (n == 0 || n == 6) {
        total1 = this.totalTravelHours + enrollment.events.totalTravelHours;
        weekendHours = weekendHours + total1;
        weekendCount++;
      } else {
        total1 = this.totalTravelHours + enrollment.events.totalTravelHours;
        weekdayHours = weekdayHours + total1;
        weekdayCount++;
      }
    });

    this.totalVolunteeringHours = total;
    
    let cover = this.uniqueVolunteersCount / this.totalAssociatesCount
    this.coverage = cover.toFixed(2);
    let avgFreq = this.uniqueVolunteersCount / this.totalVolunteersCount;
    this.averageFreqVolunteer = avgFreq.toFixed(2);

    this.avgHourAssociate = Math.floor(this.totalVolunteeringHours / this.totalAssociatesCount);
    this.avgHourVolunteer = Math.floor(this.totalVolunteeringHours / this.uniqueVolunteersCount);
    this.totalEvents = this.allEvents.length;

    let avgVolunteeredHours = 0;

    this.avgHoursPerEventWeekday = weekdayHours / weekdayCount;
    this.avgHoursPerEventWeekend = weekendHours / weekendCount;

    this.avgVolunteersEvent = this.totalVolunteersCount / this.totalEvents;

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


  stacked3dChart() {

    // Create chart instance
    let chart = am4core.create("DesignationWiseVolunteersVsAssociates", am4charts.XYChart3D);

    // Add data
    chart.data = this.getDesignationWiseVolunteerVsAssociate();

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



}

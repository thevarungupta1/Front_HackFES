import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
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
  yearlyData: any[];
  eventGridData:Event[];
  constructor(private zone: NgZone, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    //    generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }

    this.getAllAssociates();
    this.getAllEvents();
    this.getAllEnrollments();
    this.getAllVolunteers();
    this.getTopVolunteers();
    this.getYearlyVolunteers();
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
  getAllEvents() {
    this.dashboardService.getAllEvents().subscribe(data => {
      this.allEvents = data;
      this.totalEvents = data.length;

    });
  }

  getAllEnrollments() {
    this.dashboardService.getAllEnrollments().subscribe(data => {
      this.allEnrollments = data;
      this.totalVolunteers = data.length;

    });
  }
  getAllVolunteers() {
    console.log(this.allEnrollments);
    this.allVolunteers = this.allEnrollments.map(e => e.associates);
    console.log('allvolunters');
    console.log(this.allVolunteers);
  }

  getTopVolunteers() {
    this.topVolunteers = [];
    this.dashboardService.getTopVolunteers(5).subscribe(data => {
      let groupedData = this.groupBy(data, function (item) {
        return [item.id];
      });

      groupedData.forEach(g => this.topVolunteers.push({ associate: g[0], count: g.length }));
      console.log(this.topVolunteers);
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
  getYearlyVolunteers() {
    this.dashboardService.getYearlyVolunteers(5).subscribe(data => {
      console.log('getYearlyVolunteers')
      console.log(data);
      this.yearlyData = [];
      let total: number = 0;
      let newPercent: number = 0;
      let recurPercent: number = 0;
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // total = parseInt(data[key][0]) + parseInt(data[key][1]);
          // newPercent = parseInt(data[key][0]) / total * 100
          // recurPercent = parseInt(data[key][1]) / total * 100
         // this.yearlyData.push({ year: key, newVolunteer: newPercent, recurVolunteer: recurPercent });
         this.yearlyData.push({ year: key, newVolunteer: data[key][0], recurVolunteer: data[key][1] });
        }
      }
      console.log('columnchart');
this.lineGraph();
      this.barChart();
      //data.forEach(x=> {console.log(x.key);console.log(x.value);});
    });
    
  }

  joinRecords() {
    this.top10Volunteers = [];
    this.allVolunteers = [];
    this.allEnrollments.map((enrollment) => {
      let associate = this.allAssociates.find((en) => enrollment.associateID === en.id);
      let event = this.allEvents.find((ev) => enrollment.eventID === ev.id);
      if (associate)
        this.allVolunteers.push(Object.assign(enrollment, associate, event));


      //Object.assign(a,obj2);
      //return a;
    });

    let groupedData = this.groupBy(this.allVolunteers, function (item) {
      return [item.associateID];
    });
    let arr = [];
    groupedData.forEach(x => {
      arr.push({ 'associate': x[0], count: x.length });
    });
    console.log('arr');
    console.log(arr);
    this.top10Volunteers.push();

    this.lineChart();
  }

  lineChart() {
    console.log('linechart');
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;

    let data = [];
    let visits = 10;
    let previousValue;

    //data = [];
    let count = 10;
    let i = 0;
    console.log('this.allVolunteers');
    console.log(this.allVolunteers);
    this.allVolunteers.forEach(v => {

      count = count + 20;
      if (i > 0) {
        // add color to previous data item depending on whether current value is less or more than previous value
        if (previousValue <= count) {
          data[i - 1].color = chart.colors.getIndex(0);
        }
        else {
          data[i - 1].color = chart.colors.getIndex(5);
        }
      }
      i++;
      data.push({ date: new Date(v.date), value: count });
      previousValue = count;
    })
    console.log('data');
    console.log(data);
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
    series.dataFields.valueY = "value";
    series.strokeWidth = 2;
    series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";

    // set stroke property field
    series.propertyFields.stroke = "color";

    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX = scrollbarX;

    chart.events.on("ready", function (ev) {
      dateAxis.zoomToDates(
        chart.data[50].date,
        chart.data[80].date
      );
    });

  }

  barChart() {
    // Create chart instance
    this.chart = am4core.create("barChart", am4charts.XYChart);

    // Add data
    this.chart.data = this.yearlyData.reverse();

    // Create axes
    let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;


    this.createSeries("newVolunteer", "New Volunteers");
    this.createSeries("recurVolunteer", "Recurring Volunteers");
  }

  lineGraph(){
    let chart = am4core.create("columnChart", am4charts.XYChart);

// let data = [];
// let value = 50;
// for(let i = 0; i < 300; i++){
//   let date = new Date();
//   date.setHours(0,0,0,0);
//   date.setDate(i);
//   value -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
//   data.push({date:date, value: value});
// }

chart.data = this.yearlyData.reverse();

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "newVolunteer";
series.dataFields.dateX = "year";
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

  columnChart() {

    // Create chart instance
    let chart = am4core.create("columnChart", am4charts.XYChart);

    // Add percent sign to all numbers
    chart.numberFormatter.numberFormat = "#.3'%'";

    // Add data
    chart.data = this.yearlyData.reverse();

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "GDP growth rate";
    //valueAxis.title.fontWeight = 800;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "newVolunteer";
    series.dataFields.categoryX = "year";
    series.clustered = false;
    series.tooltipText = "GDP grow in {categoryX} (2004): [bold]{valueY}[/]";

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "recurVolunteer";
    series2.dataFields.categoryX = "year";
    series2.clustered = false;
    series2.columns.template.width = am4core.percent(50);
    series2.tooltipText = "GDP grow in {categoryX} (2005): [bold]{valueY}[/]";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

  }
  radioModel: string = 'Month';

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A'
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


}

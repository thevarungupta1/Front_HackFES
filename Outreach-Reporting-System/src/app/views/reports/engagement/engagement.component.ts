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

  allEnrollments: Enrollment[] = [];
  allVolunteers: any[] = [];
  allAssociates: Associate[] = [];
volunteersFreq: any[];
totalVolunteers: number;
public innerWidth: any;

  constructor(private zone: NgZone, private engagementService: EngagementService) { }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(){
    this.getAllAssociates();
  }

  getAllAssociates() {
    this.engagementService.getAllAssociates().subscribe(data => {
      this.allAssociates = data;
      this.getAllEnrollments();
    });
  }

  getAllEnrollments() {
    this.engagementService.getAllEnrollments().subscribe(data => {
      this.allEnrollments = data;
      this.joinRecords();
    });
  }
  
  joinRecords(){
    this.allVolunteers =[];
  this.allEnrollments.map((enrollment)=>{
    let associate = this.allAssociates.find((en)=> enrollment.associateID === en.id);
    if(associate)
    this.allVolunteers.push(Object.assign(enrollment, associate));
   });
   this.groupVolunteers();
   this.pieChart('volunteersFreqChart');
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

  groupVolunteers() {
    let groupedData = this.groupBy(this.allVolunteers, function (item) {
      return [item.associateID];
    });
    console.log('groupedData');
console.log(groupedData);
this.volunteersFreq = [];
let oneTime = 0;
let twoToFiveTimes = 0;
let fivePlusTimes = 0;
groupedData.forEach(v => {
  if(v.length == 1)//one time
  oneTime++;
  else if(v.length > 5)//five plus time
  fivePlusTimes++;
  else //two to five time
  twoToFiveTimes++;

});
let totalVolunteers = this.allEnrollments.length;
this.volunteersFreq.push({'frequency':'One Time Volunteers', 'countinpercent': oneTime/totalVolunteers});
this.volunteersFreq.push({'frequency':'Two To Five Volunteers', 'countinpercent': twoToFiveTimes/totalVolunteers});
this.volunteersFreq.push({'frequency':'Five Plus Time Volunteers', 'countinpercent': fivePlusTimes/totalVolunteers});

  }

  pieChart(chartcontainer: string) {
    this.zone.runOutsideAngular(() => {
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
    });
  }

  ngAfterViewInit(){
    let chart = am4core.create("chartdiv", am4charts.XYChart3D);
    // Add data
chart.data = [{
  "country": "USA",
  "visits": 4025,
  "color": chart.colors.next()
}, {
  "country": "China",
  "visits": 1882,
  "color": chart.colors.next()
}, {
  "country": "Japan",
  "visits": 1809,
  "color": chart.colors.next()
}, {
  "country": "Germany",
  "visits": 1322,
  "color": chart.colors.next()
}, {
  "country": "UK",
  "visits": 1122,
  "color": chart.colors.next()
}, {
  "country": "France",
  "visits": 1114,
  "color": chart.colors.next()
}, {
  "country": "India",
  "visits": 984,
  "color": chart.colors.next()
}, {
  "country": "Spain",
  "visits": 711,
  "color": chart.colors.next()
}, {
  "country": "Netherlands",
  "visits": 665,
  "color": chart.colors.next()
}, {
  "country": "Russia",
  "visits": 580,
  "color": chart.colors.next()
}, {
  "country": "South Korea",
  "visits": 443,
  "color": chart.colors.next()
}, {
  "country": "Canada",
  "visits": 441,
  "color": chart.colors.next()
}, {
  "country": "Brazil",
  "visits": 395,
  "color": chart.colors.next()
}, {
  "country": "Italy",
  "visits": 386,
  "color": chart.colors.next()
}, {
  "country": "Australia",
  "visits": 384,
  "color": chart.colors.next()
}, {
  "country": "Taiwan",
  "visits": 338,
  "color": chart.colors.next()
}, {
  "country": "Poland",
  "visits": 328,
  "color": chart.colors.next()
}];

// Create axes
let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.labels.template.rotation = 270;
categoryAxis.renderer.labels.template.hideOversized = false;
categoryAxis.renderer.minGridDistance = 20;
categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.renderer.labels.template.verticalCenter = "middle";
categoryAxis.tooltip.label.rotation = 270;
categoryAxis.tooltip.label.horizontalCenter = "right";
categoryAxis.tooltip.label.verticalCenter = "middle";

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.title.text = "Countries";
valueAxis.title.fontWeight = "bold";

// Create series
let series = chart.series.push(new am4charts.ColumnSeries3D());
series.dataFields.valueY = "visits";
series.dataFields.categoryX = "country";
series.name = "Visits";
series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;
series.columns.template.propertyFields.fill = "color";

let columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;
columnTemplate.stroke = am4core.color("#FFFFFF");

chart.cursor = new am4charts.XYCursor();
chart.cursor.lineX.strokeOpacity = 0;
chart.cursor.lineY.strokeOpacity = 0;

// Enable export
chart.exporting.menu = new am4core.ExportMenu();
  }

  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }
}

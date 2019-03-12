import {Component, SecurityContext, NgZone} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  templateUrl: 'retention.component.html'
})
export class RetentionComponent {

  constructor(sanitizer: DomSanitizer) {
    //this.html = sanitizer.sanitize(SecurityContext.HTML, this.html);
  }

  // title: string = 'Welcome word';
  // content: string = 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.';
  // html: string = `<span class="btn btn-warning">Never trust not sanitized <code>HTML</code>!!!</span>`;

  ngAfterViewInit(){
    let chart = am4core.create("chartdiv1", am4charts.PieChart);

    chart.data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    }];

    // Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
    //chart.dataSource.url = "pie_chart_data.json";
  }
}

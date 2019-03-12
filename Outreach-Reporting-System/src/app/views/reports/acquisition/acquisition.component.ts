import {Component, OnDestroy} from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

// // Importing themes
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import am4themes_dark from "@amcharts/amcharts4/themes/dark";

// // Importing translations
// import am4lang_lt_LT from "@amcharts/amcharts4/lang/lt_LT";

// // Importing geodata (map data)
// import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

@Component({
  templateUrl: 'acquisition.component.html'
})
export class AcquisitionComponent implements OnDestroy {

  ngAfterViewInit(){
    // let map = am4core.create("chartdiv", am4maps.MapChart);
    // map.geodata = am4geodata_worldLow;

    // map.geodataSource.url = "/path/to/myCustomMap.json";
    // map.projection = new am4maps.projections.Miller();

    var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#74B266");

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#367B25");

  }
  max: number = 200;
  showWarning: boolean;
  dynamic: number;
  type: string;

  stacked: any[] = [];

  timer: any = null;
  buttonCaption: string = 'Start';

  constructor() {
    this.random();
    this.randomStacked();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    // console.log(`onDestroy`, this.timer);
  }

  random(): void {
    const value = Math.floor(Math.random() * 100 + 1);
    let type: string;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    this.showWarning = type === 'danger' || type === 'warning';
    this.dynamic = value;
    this.type = type;

  }

  randomStacked(): void {
    const types = ['success', 'info', 'warning', 'danger'];

    this.stacked = [];
    const n = Math.floor(Math.random() * 4 + 1);
    for (let i = 0; i < n; i++) {
      const index = Math.floor(Math.random() * 4);
      const value = Math.floor(Math.random() * 27 + 3);
      this.stacked.push({
        value,
        type: types[index],
        label: value + ' %'
      });
    }
  }

  randomize(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(() => this.randomStacked(), 2000);
    }
    this.buttonCaption = this.timer ? 'Stop' : 'Start';
  }
}

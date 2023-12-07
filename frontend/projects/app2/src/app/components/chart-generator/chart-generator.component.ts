import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import { SharedDataService } from '../../services/shared-data.service';
HC_exporting(Highcharts);
offlineExporting(Highcharts);
@Component({
  selector: 'app-chart-generator',
  templateUrl: './chart-generator.component.html',
  styleUrls: ['./chart-generator.component.css'],
})
export class ChartGeneratorComponent implements OnInit {
  csvHeadings: any;
  fileId!: number;
  xAxis: string = '';
  yAxis: string = '';
  xdataPoints!: any;
  ydataPoints!: any;
  type: string = '';
  highcharts: typeof Highcharts = Highcharts;
  chartOptions!: any;
  //new
  labelRotation: number = 0;
  tickInterval: number = 0;
  xAxisMin!: number;
  xAxisMax!: number;
  axisType: string = 'category';
  logScale: boolean = false;
  reverseAxis: boolean = false;
  xcustomVisible: boolean = false;
  isChartVisible: boolean = false;
  ycustomVisible: boolean = false;
  ylabelRotation: number = 0;
  ytickInterval: number = 0;
  yAxisMin!: number;
  yAxisMax!: number;
  yaxisType: string = 'category';
  ylogScale: boolean = false;

  constructor(
    private sharedDataService: SharedDataService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.sharedDataService.csvHeadingsSubject.subscribe((response: any) => {
      this.csvHeadings = response.columnInfo;
      this.fileId = response.fileId;
    });
  }
  generateChart(type: string) {
    if (type === 'line') {
      this.type = 'line';
      this.chartOptions = {
        chart: {
          zoomType: 'xy',
          type: this.type,
          scrollbar:{
            enabled:true
          }
        },
        rangeSelector: {
          enabled: true,
        },
        title: {
          text: 'Demo chart',
          style: {
            color: 'orange',
          },
        },
        subtitle: {
          text: 'Demo chart subtitle',
          style: {
            color: 'orange',
          },
        },
        xAxis: {
          scrollbar: {
            enabled: true,
            showFull: false
        },
          categories: this.xdataPoints,
          labels: {
            formatter: function() {
              return '<p style="color:red">' + this.value 
            },
            style: {
              color: 'black',
              rotation: this.labelRotation + 'deg',
            },
          },
          tickInterval: this.tickInterval,
          type: this.axisType,
          min: this.xAxisMin,
          max: this.xAxisMax,
        },
        yAxis: {
          text: 'Temperature',
          labels: {
            formatter: function() {
              return '<p style="color:red">' + this.value
            },
            style: {
              color: 'black',
              rotation: this.ylabelRotation + 'deg',
            },
          },
          tickInterval: this.ytickInterval,
          type: this.yaxisType,
          min: this.yAxisMin,
          max: this.yAxisMax,
          reversed: this.reverseAxis,
        },
        exporting: {
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                },
              },
            },
          },
          fallbackToExportServer: false,
        },
        series: [{ data: this.ydataPoints }],
        credits: {
          enabled: false,
        },
        scrollbar:{
          enabled:true
        }
      };
      this.isChartVisible = true;
    } else if (type === 'bar') {
      this.type = 'bar';
      this.chartOptions = {
        chart: {
          type: this.type,
        },
        title: {
          text: 'Demo chart',
          style: {
            color: 'orange',
          },
        },
        subtitle: {
          text: 'Demo chart subtitle',
          style: {
            color: 'orange',
          },
        },
        xAxis: {
          categories: this.xdataPoints,
          labels: {
            style: {
              color: 'black',
            },
          },
        },
        yAxis: {
          text: 'Temperature',
          labels: {
            style: {
              color: 'black',
            },
          },
        },
        exporting: {
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                },
              },
            },
          },
          fallbackToExportServer: false,
        },
        series: [{ data: this.ydataPoints }],
        credits: {
          enabled: false,
        },
        scrollbar:{
          enabled:true
        }
      };
      this.isChartVisible = true;
    } else if (type === 'pie') {
      const pieChartData = this.xdataPoints.map(
        (label: string, index: number) => ({
          name: label,
          y: this.ydataPoints[index],
        })
      );
      this.type = 'pie';
      this.chartOptions = {
        chart: {
          type: this.type,
        },
        title: {
          text: 'Demo Pie Chart',
          style: {
            color: 'blue',
          },
        },
        series: [
          {
            name: 'Categories',
            data: pieChartData,
          },
        ],
      };
    }
    this.isChartVisible = true;
  }

  sendAxesToBackend(filename: string): void {
    const axes = { xAxis: this.xAxis, yAxis: this.yAxis, filename: filename };
    this.http.post('http://localhost:3000/test/getChartData', axes).subscribe(
      (response: any) => {
        this.xdataPoints = response.xaxisPoints;
        this.ydataPoints = response.yaxisPoints;
        this.generateChart('line');
      },
      (error) => {
        console.error('Error sending axes to backend:', error);
      }
    );
  }
  drop(event: CdkDragDrop<string[]>): void {
    if (event.container.id === 'x-axis-list') {
      this.xAxis = event.item.data.heading;
    } else if (event.container.id === 'y-axis-list') {
      console.log(event.item.data.dataType);

      if (
        event.item.data.dataType !== 'number' &&
        event.item.data.dataType !== 'date'
      ) {
        alert(
          'Y-Axis can only have numeric values. Please Select a numeric field'
        );
      } else {
        this.yAxis = event.item.data.heading;
      }
    }
    if (this.xAxis && this.yAxis) {
      let selected!: string;
      this.sharedDataService.csvFileNameSubject.subscribe((data) => {
        selected = data;
      });
      this.sendAxesToBackend(selected);
    }
  }
  setline() {
    this.generateChart('line');
  }
  setbar() {
    this.generateChart('bar');
  }
  setPie() {
    this.generateChart('pie');
  }
  customizeX() {
    this.isChartVisible = false;
    this.xcustomVisible = !this.xcustomVisible;
  }
  customizeY() {
    this.isChartVisible = false;
    this.ycustomVisible = !this.ycustomVisible;
  }
  XDone() {
    this.xcustomVisible = !this.xcustomVisible;
    this.generateChart('line');
  }
  YDone() {
    this.ycustomVisible = !this.ycustomVisible;
    this.generateChart('line');
  }
}

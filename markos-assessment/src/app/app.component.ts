import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public highcharts = Highcharts;
  public updateGraph: boolean;
  public formGroup = new FormGroup({
    cpu: new FormControl(true),
    instance: new FormControl(true),
  });

  private refresh$ = new Subject();
  private destroyed$ = new Subject();

  private cpuSeries: Highcharts.SeriesOptionsType = {
    name: 'milicores',
    type: 'line',
    marker: { enabled: false },
    color: '#2a65a6',
    yAxis: 1,
    data: this.utilService.cpuData,
    visible: true,
  };

  private instanceSeries: Highcharts.SeriesOptionsType = {
    name: 'Instance Count',
    type: 'column',
    pointPadding: 0,
    groupPadding: 0,
    color: '#8ad1ee',
    data: this.utilService.instanceData,
    visible: true,
  };

  public chartOptions: Highcharts.Options = {
    title: {
      text: 'CHART TITLE',
      align: 'left',
      x: 87,
      y: 0,
      style: {
        fontWeight: 'bolder',
        fontSize: '16px',
        color: '#666666',
        textOutline: '0.2px #666666',
      },
    },
    xAxis: [
      {
        type: 'datetime',
        tickInterval: 1000 * 60 * 15,
        tickAmount: 11,
        gridLineWidth: 1,
        dateTimeLabelFormats: {
          hour: '%h%P:%M',
        },
        labels: {
          formatter: (date) =>
            new Date(date.value).getMinutes()
              ? Highcharts.dateFormat('%l:%M', parseInt(date.value, 10))
              : Highcharts.dateFormat('%l:%M %p', parseInt(date.value, 10)),
          style: {
            fontWeight: 'bold',
          },
        },
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        title: {
          text: 'Instance Count',
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          x: 89,
        },
        tickAmount: 8,
        tickInterval: 1,
        labels: {
          style: {
            fontWeight: 'bold',
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: 'millicores',
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          x: -65,
        },
        tickAmount: 8,
        tickInterval: 200,
        labels: {
          formatter: (y) =>
            parseInt(y.value, 0) > 1000
              ? (parseInt(y.value, 10) / 1000).toString() + 'k'
              : y.value,
          style: {
            fontWeight: 'bold',
          },
        },
        opposite: true,
      },
    ],
    series: [this.instanceSeries, this.cpuSeries],
    chart: {
      backgroundColor: '#F5F5F5',
      plotBackgroundColor: '#FFFFFF',
      spacing: [50, 10, 15, 10],
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  public onClick() {
    this.refresh$.next();
  }

  public listenForRefresh() {
    this.refresh$
      .pipe(takeUntil(this.destroyed$), debounceTime(500))
      .subscribe(() => {
        this.utilService.generateValues();
        this.updateGraph = true;
      });
  }

  public ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.cpuSeries.visible = this.formGroup.controls.cpu.value
          ? true
          : false;
        this.instanceSeries.visible = this.formGroup.controls.instance.value
          ? true
          : false;

        this.updateGraph = true;
      });

    this.listenForRefresh();
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  constructor(private utilService: UtilitiesService) {}
}

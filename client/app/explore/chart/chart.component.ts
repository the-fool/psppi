import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { lensProp, map, prop, set } from 'ramda';
declare const d3: any;

interface BarData {
  key: string;
  values: { label: string, value: number }[];
}

interface Datum {
  label: string;
  value: number;
}

@Component({
  selector: 'chart',
  template: `
    <div>
    <nvd3 [options]="options" [data]="data"></nvd3>
    </div>
    `
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() questionData: IQuestionData;
  @Input() year: string;
  private data;
  private options;
  private barOptions = {
    chart: {
      type: 'discreteBarChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x: prop('label'),
      y: prop('value'),
      showValues: true,
      valueFormat: d3.format(',.0f'),
      duration: 500,
      xAxis: {
        axisLabel: 'X Axis'
      },
      yAxis: {
        axisLabel: 'Y Axis',
        axisLabelDistance: -10
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['year']) {
      if (this.year === 'all') {
        // TODO
        return;
      }
      const values = this.translateLabels(
        this.questionData.values,
        this.computeBarData(this.questionData.responses[this.year].values)
      );
      this.data = [{
        key: this.questionData.code,
        values
      }];
      console.log(this.data);
    }
  }

  computeBarData(data: {count: number, demog: string, value: string}[]): Datum[] {
    const datumToBar = (d: {count: number, demog: string, value: string}) => {
      const label = d.value;
      const value = d.count;
      return {label, value};
    };
    return map(datumToBar, data);
  }

  translateLabels(labelDict: {[key: number]: string}, data: Datum[]) {
    const setLabel = (d: Datum) => {
      const newLabel = labelDict[+d.label];
      return set(lensProp('label'), newLabel, d);
    };
    return map(setLabel, data);
  }

  ngOnInit() {
    this.options = this.barOptions;
    this.data = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label": "A",
            "value": -29.765957771107
          },
          {
            "label": "B",
            "value": 0
          },
          {
            "label": "C",
            "value": 32.807804682612
          },
          {
            "label": "D",
            "value": 196.45946739256
          },
          {
            "label": "E",
            "value": 0.19434030906893
          },
          {
            "label": "F",
            "value": -98.079782601442
          },
          {
            "label": "G",
            "value": -13.925743130903
          },
          {
            "label": "H",
            "value": -5.1387322875705
          }
        ]
      }
    ];

  }
}
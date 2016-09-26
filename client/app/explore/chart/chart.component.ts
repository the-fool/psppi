import { Component, ViewEncapsulation, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { add, compose, groupBy, keys, lensProp, map, prop, reduce, set } from 'ramda';
declare const d3: any;
const style = require('nvd3/build/nv.d3.css');

interface BarData {
  key: string;
  values: Datum[];
}

interface Datum {
  label: string;
  value: number;
}

@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  template: `
    <div>
    <nvd3 [options]="options" [data]="data"></nvd3>
    </div>
    `
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() questionData: IQuestionData;
  @Input() year: string;
  @Input() demogDict: { [code: string]: IDemography };
  private data: BarData[];
  private options;
  private barOptions = {
    chart: {
      type: 'multiBarChart',
      height: 500,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      //forceY: [0, 1],
      x: prop('label'),
      y: prop('value'),
      showValues: true,
      tooltip: {
        valueFormatter: d3.format(',.1%')
      },
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
    let values;
    if (changes['year'] || changes['questionData']) {
      if (this.year === 'all') {
        // TODO
        // linechart
        return;
      } else {
        const responses = this.questionData.responses[this.year].values;
        const valuesByDemog = groupBy<IResponse>(prop('demog'), responses);
        console.log('VsByDemog', valuesByDemog);
        const demogDict = this.questionData.demog === 'any' ?
          { 0: 'Any' } :
          this.demogDict[this.questionData.demog].values;
        this.data = map(
          demog => ({
            key: demogDict[demog],
            values: this.translateLabels(
              this.questionData.values,
              this.computeBarData(valuesByDemog[demog])
            )
          }), keys(valuesByDemog));
        console.log(this.data);
      }
    }
  }

  computeBarData(data: { count: number, demog: string, value: string }[]): Datum[] {
    const denom = reduce<number, number>(add, 0, map<IResponse, number>(prop('count'), data));
    const datumToBar = (d: { count: number, demog: string, value: string }) => {
      const label = d.value;
      const value = d.count / denom;
      const demog = d.demog;
      return { label, value };
    };
    return map(datumToBar, data);
  }

  translateLabels(labelDict: { [key: number]: string }, data: Datum[]) {
    const setLabel = (d: Datum) => {
      const newLabel = labelDict[+d.label];
      return set(lensProp('label'), newLabel, d);
    };
    return map(setLabel, data);
  }

  ngOnInit() {
    this.options = this.barOptions;
  }
}

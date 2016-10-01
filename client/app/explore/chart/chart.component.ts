import { Component, ViewEncapsulation, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import {
  add, always, compose, find, filter, groupBy, ifElse, isNil, keys, lensProp, map,
  mapObjIndexed, not, prop, propEq, reduce, set, toPairs, values, xprod
} from 'ramda';
declare const d3: any;
const nvd3 = require('nvd3/build/nv.d3.css');
const style = require('./chart.style');

interface BarData {
  key: string;
  values: Datum[];
}

interface Datum {
  label: string;
  value: number;
}

interface ResponseOpt {
  key: number;
  label: string;
}


@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  styles: [nvd3, style],

  template: `
    <div>
    <nvd3 [options]="options" [data]="data"></nvd3>
    <div class="btn-grp">
      <label *ngFor="let r of responseOpts" class="btn btn-primary" [(ngModel)]="selectedSpecificResponse"
            btnRadio="{{r.key}}" (click)="_constructLineData(r.key)">
            {{r.label}}
    </label>
    </div>
    </div>
    `
})
export class ChartComponent implements OnChanges {
  @Input() questionData: IQuestionData;
  @Input() year: string;
  @Input() demogDict: { [code: string]: IDemography };
  private data: any;
  private options = null;
  private selectedSpecificResponse: number;
  private responseOpts = [];
  private lineOptions = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      forceY: [0, 1],
      x: prop('x'),
      y: prop('y'),
      useInteractiveGuideline: true,
      xAxis: {
        axisLabel: 'Year'
      },
      yAxis: {
        axisLabel: 'Percentage',
        tickFormat: d3.format(',.0%'),
        axisLabelDistance: -10
      },
    }
  };
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
      forceY: [0, 1],
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

  private pieOptions = {
    chart: {
      type: 'pieChart',
      height: 700,
      donut: true,
      x: prop('key'),
      y: prop('y'),
      showLabels: true,
      duration: 500,
      pie: {
        startAngle: d => d.startAngle / 2 - Math.PI / 2,
        endAngle: d => d.endAngle / 2 - Math.PI / 2
      },
      legend: {
        margin: {
          top: 5,
          right: 140,
          bottom: 5,
          left: 0
        }
      }
    }
  };

  _constructLineData(specificResponse?: number) {
    const demogDict = this._getDemogDict(this.questionData);
    const valueDict = this.questionData.values;

    // Group data series by response values, or response demography
    // if there is a specific response to filter by, then we group data by demog
    // else, we show all response values
    let seriesDict;
    let filterPredicate; // how to filter response data
    let seriesKey;
    if (isNil(specificResponse)) {
      seriesDict = valueDict;
      filterPredicate = always(true); // 'any' demog requires no filtering
      seriesKey = 'value';
    } else {
      seriesDict = demogDict;
      filterPredicate = propEq('value', specificResponse.toString());
      seriesKey = 'demog';
    }
    // valuesByYear :: { [year: number]: IResponse[] }    
    const valuesByYearByGrouping = mapObjIndexed(
      (year, key, responses) => {
        const allValues = responses[key].values;
        const possibleValues = filter<IResponse>(filterPredicate, allValues);
        return <{[key: string]: IResponse}>reduce((acc, v) => set(lensProp(prop<string>(seriesKey, v)), v, acc), {}, possibleValues);
      },
      this.questionData.responses
    );

    this.data = map(
      k => ({
        key: `${seriesDict[k]}`, // get nice label
        values: map(
          year => ({
            x: +year,
            y: this.computeLineDatum(
              valuesByYearByGrouping[year][k],
              values(valuesByYearByGrouping[year]))
          }),
          keys(valuesByYearByGrouping)
        )
      }),
      keys(seriesDict));
      console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['year'] || changes['questionData']) {
      if (this.year === 'all') {
        // set line chart scheme
        this.options = this.lineOptions;

        // are we grouping by demog?
        if (this.questionData.demog === 'any') {
          // clear out responseOpt buttons
          this.responseOpts = [];
          this._constructLineData();
        } else {
          // set response opt buttons
          this.responseOpts = map(e => ({ key: e[0], label: e[1] }), toPairs(this.questionData.values));
          // Pick first response value, as default
          this.selectedSpecificResponse = this.responseOpts[0].key;
          this._constructLineData(this.selectedSpecificResponse);
        }
      } else if (this.questionData.demog !== 'any') {
        // Individual year, individual demog
        this.options = this.barOptions;
        const valuesByDemog = this._getValuesGroupedByDemog(this.questionData.responses[this.year].values);
        const demogDict = this._getDemogDict(this.questionData);
        this.data = map(
          demog => ({
            key: demogDict[demog],
            values: this.translateLabels(
              this.questionData.values,
              this.computeBarData(valuesByDemog[demog])
            )
          }), keys(valuesByDemog));
      } else {
        // Individual year, no demog
        this.options = this.pieOptions;
        this.data = [
          {
            key: "One",
            y: 5
          },
          {
            key: "Two",
            y: 2
          },
          {
            key: "Three",
            y: 9
          },
          {
            key: "Four",
            y: 7
          },
          {
            key: "Five",
            y: 4
          },
          {
            key: "Six",
            y: 3
          },
          {
            key: "Seven",
            y: .5
          }
        ];

      }
    }
  }

  _getValuesGroupedByDemog(responses: IResponse[]) {
    return groupBy<IResponse>(prop('demog'), responses);
  }

  _getDemogDict(questionData: IQuestionData): { [code: string]: string } {
    return questionData.demog === 'any' ? { 0: 'Any' } : this.demogDict[this.questionData.demog].values;
  }

  _getDenominator(data: IResponse[]) {
    return reduce<number, number>(add, 0, map<IResponse, number>(ifElse(prop('count'), prop('count'), always(0)), data));
  }

  computeLineDatum(datum: any, data: IResponse[]) {
    if (!data) return 0;
    const denom = this._getDenominator(data);
    return datum ? datum.count / denom : 0;
  }

  computeBarData(data: IResponse[]): Datum[] {
    const denom = this._getDenominator(data);
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
}

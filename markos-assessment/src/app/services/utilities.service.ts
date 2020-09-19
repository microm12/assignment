import { Injectable } from '@angular/core';
import { cpuData } from '../data/dataset-cpu';
import { instanceData } from '../data/dataset-instances';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor() {}

  public cpuData = cpuData
    .map((item) => ({
      x: new Date(item.time).getTime(),
      y: item['CPU Usage Millicores'],
    }))
    .filter((item) => item.y);

  public instanceData = instanceData
    .map((item) => ({
      x: new Date(item.time).getTime(),
      y: item['Service Instance Count'],
    }))
    .filter((item) => item.y);

  public generateValues() {
    const lastValue = this.instanceData[this.instanceData.length - 2].y;
    const newCPUValue = lastValue + this.randn_bm(-700, 700, -1);
    this.instanceData.push({
      x: this.generateNewInstanceTime(),
      y: Math.round(this.cpuData[this.cpuData.length - 2].y / 400),
    });
    this.cpuData.push({
      x: this.generateNewCPUTime(),
      y: Math.round(newCPUValue),
    });
  }

  private generateNewCPUTime() {
    const lastTime = new Date(
      this.cpuData[this.cpuData.length - 1].x
    ).getTime();
    return lastTime + 1000 * 30;
  }

  private generateNewInstanceTime() {
    const lastTime = new Date(
      this.instanceData[this.instanceData.length - 1].x
    ).getTime();
    return lastTime + 1000 * 30;
  }

  public randn_bm(min, max, skew) {
    let u = 0;
    let v = 0;
    while (u === 0) {
      u = Math.random();
    } // Converting [0,1) to (0,1)
    while (v === 0) {
      v = Math.random();
    }
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      num = this.randn_bm(min, max, skew);
    } // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  }
}

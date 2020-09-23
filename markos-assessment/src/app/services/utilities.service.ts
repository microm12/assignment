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
    .filter((item) => item.y !== null);

  public instanceData = instanceData
    .map((item) => ({
      x: new Date(item.time).getTime(),
      y: item['Service Instance Count'],
    }))
    .filter((item) => item.y !== null);

  public generateValues() {
    const generationRange = 900;
    const skewFactor = -1.4;
    const reductionScale = 400;

    const lastValue = this.instanceData[this.instanceData.length - 2].y;
    const newCPUValue =
      lastValue +
      this.rand_normal_dist(-generationRange, generationRange, skewFactor);

    const newInstance = this.instanceData.slice(1);
    const newCpu = this.cpuData.slice(1);

    newInstance.push({
      x: this.generateNewInstanceTime(),
      y: Math.round(this.cpuData[this.cpuData.length - 2].y / reductionScale),
    });
    newCpu.push({
      x: this.generateNewCPUTime(),
      y: Math.round(newCPUValue),
    });

    this.cpuData = newCpu;
    this.instanceData = newInstance;
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

  public rand_normal_dist(min: number, max: number, skew: number) {
    const u = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u));

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      num = this.rand_normal_dist(min, max, skew);
    } // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  }
}

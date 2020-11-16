import { getter, model } from '../../../src/model/Model';


@model
export default class Quote {

  constructor(props?: Partial<Quote>) {
    if (props) {
      this.bid = props.bid!;
      this.ask = props.ask!;
    }
  }

  bid = 1;
  ask = 2;
  _m = -1;

  @getter
  get middle() {
    middleInvokedTimers++;
    return (this.bid + this.ask) / 2;
  }
  set middle(v) {
    this._m = v;
  }
}

export let middleInvokedTimers = 0;

export function resetMiddleInvokedTimers() {
  middleInvokedTimers = 0;
}

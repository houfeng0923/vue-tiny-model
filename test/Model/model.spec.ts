import { effect } from '@vue/reactivity';
import Quote, { middleInvokedTimers, resetMiddleInvokedTimers } from './fixtures/Quote'

/**
 * Unit tests for Model
 */
describe('new Model', () => {

  beforeEach(() => {
    /**/
  });

  describe('define', () => {
    it('should return model instance', (done) => {

      const quote = new Quote();

      expect(quote.bid).toBe(1);
      expect(quote.middle).toBe((quote.ask + quote.bid) / 2);

      quote.bid = 2;
      expect(quote.bid).toBe(2);
      expect(quote.middle).toBe((quote.ask + quote.bid) / 2);

      quote.middle = 3;
      expect(quote._m).toBe(3);
      done();
    });

    it('should getter cache work well', (done) => {
      const quote = new Quote();
      resetMiddleInvokedTimers();
      expect(middleInvokedTimers).toBe(0);
      quote.middle;
      expect(middleInvokedTimers).toBe(1);
      quote.middle;
      expect(middleInvokedTimers).toBe(1);
      quote.bid = Date.now();
      quote.middle;
      quote.middle;
      expect(middleInvokedTimers).toBe(2);
      resetMiddleInvokedTimers();
      done();
    });

    it('should computed reactive well', (done) => {
      const quote = new Quote();

      let bid;
      effect(() => {
        bid = quote.bid;
      });
      quote.bid = 10;
      expect(bid).toBe(10);


      let middle;
      effect(() => {
        middle = quote.middle;
      });
      quote.bid = 10; quote.ask = 20;
      expect(middle).toBe(15);
      done();
    });

    it('should init instance with expected props', (done) => {
      const props = {bid: 100, ask: 200};
      const quote = new Quote(props);
      expect(quote.bid).toBe(props.bid);
      expect(quote.middle).toBe((props.bid + props.ask) / 2);
      done();
    });
  });



})


import { expect } from 'chai';
import { bind, defineModel } from '../../src';

type IQuote = {
  bid: number;
  ask: number;
  price: number;
  scale: number;
  _scale: number;
};
/**
 * Unit tests for Model
 */
describe('Model', () => {

  describe('define', () => {
    it('should return model instance', (done) => {
      const QuoteModel = defineModel({
        bid: null,
        ask: null,
      } as any);
      const quote = new QuoteModel({ bid: 1, ask: 2 });
      expect(quote.bid).to.equal(1);
      // to.deep.equal()
      done();
    })
  })

  describe('define with computed', () => {
    it('should computed work well', (done) => {
      const QuoteModel = defineModel<IQuote>({
        bid: null,
        ask: null,
        _scale: null,
        price: bind<IQuote>(function () {
          return this.ask
        }),
        scale: bind<IQuote>({
          get()  {
            return this._scale;
          },
          set(v) {
            this._scale = v;
          },
        }),
      });
      const quote = new QuoteModel({ bid: 1, ask: 2, _scale: 0 });
      expect(quote.price).to.equal(2);
      expect(quote.scale).to.equal(0);
      quote.scale = 3;
      expect(quote.scale).to.equal(3);
      done();
    });
  });

})


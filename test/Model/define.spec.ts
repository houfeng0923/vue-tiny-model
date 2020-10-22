import { effect } from '@vue/reactivity';
import { bind, defineModel } from '../../src';

type IQuote = {
  bid: number;
  ask: number;
  price: number;
  scale: number;
  _scale: number;
};

type ISymbol = {
  id: number;
  name: string;
  label: string;
};

type IOrder = {
  id: number;
  symbol: ISymbol;
};

/**
 * Unit tests for Model
 */
describe('Model', () => {

  beforeEach(() => {
    /**/
  });

  describe('define', () => {
    it('should return model instance', (done) => {
      const QuoteModel = defineModel({
        bid: null,
        ask: null,
      } as any);
      const quote = new QuoteModel({ bid: 1, ask: 2 });
      expect(quote.bid).toBe(1);
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
          return this.ask;
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
      expect(quote.price).toBe(2);
      expect(quote.scale).toBe(0);
      quote.scale = 3;
      expect(quote.scale).toBe(3);

      done();
    });

    it('should computed reactive well', (done) => {
      const QuoteModel = defineModel<IQuote>({
        bid: null,
        ask: null,
        _scale: null,
        price: bind<IQuote>(function () {
          return this.ask;
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
      let scale = 0;
      effect(() => {
        scale = quote.scale;
      });
      quote.scale = 3;
      expect(scale).toBe(quote.scale);
      done();
    });

  });

  describe('composited prop', () => {
    it('composited prop work well', (done) => {
      const SymbolModel = defineModel<ISymbol>({
        id: null,
        name: '',
        label: bind(function() {
          return `[${this.name.toUpperCase()}]`;
        }),
      });
      const symbol = new SymbolModel({id: 1, name: 'usdjpy'});
      const symbol2 = new SymbolModel({id: 2, name: 'eurjpy'});
      const Order = defineModel<IOrder>({
        id: null,
        symbol: null,
      });
      const order = new Order({id: 10, symbol});
      let currentSymbol;
      expect(order.symbol.label).toBe('[USDJPY]');
      effect(() => {
        currentSymbol = order.symbol;
      });
      // reactive
      order.symbol = symbol2;
      expect(currentSymbol).toBe(symbol2);
      done();
    });
  });
})


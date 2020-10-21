
# Tiny Model layer for vue3

### Usage

```
import { bind, defineModel } from 'vue-tiny-model';

interface IQuote {
  bid: number;
  ask: number;
  mid: number;
}

const Quote = defineModel<IQuote>({
  bid: null,
  ask: null,
  mid: bind<IQuote>(function () {
    return (this.ask + this.bid) / 2;
  }),
});

const raw = response.data;

const quote = new Quote(raw);


```

### Development

#### Install

Install the dependencies with [`yarn`](https://yarnpkg.com/en/):

```
yarn
```

#### Build

```
yarn build --watch
```

#### Test

```
yarn test --watch
```

### License

[MIT](LICENSE)

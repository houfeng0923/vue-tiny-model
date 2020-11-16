
# Tiny Model layer for vue3

### Usage

#### defineModel()

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

const quote = new Quote({bid: 1, ask: 2);


```

#### class API

```
// model/Quote.ts

import { model, getter } from 'vue-tiny-model';

@model
export class Quote {
  bid = 0;
  ask = 0;

  @getter
  get mid() {
    return (this.bid + this.ask) / 2;
  }
}

// app.ts

const quote = new Quote({bid:1, ask: 2});



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

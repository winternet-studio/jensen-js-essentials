# jensen-js-essentials

Some essential Javascript tools for web development — built as ES modules.

Matching PHP library with many of the same tools (plus a lot more): https://github.com/winternet-studio/jensenfw2


## Installation

`npm install jensen-js-essentials`

### Composer (PHP)

To install using Composer add this to your `composer.json`:

```
"repositories": [
  {
    "type": "composer",
    "url": "https://asset-packagist.org"
  }
]
```

Now install with `composer require npm-asset/jensen-js-essentials "^1.2.0"`.


## Usage

```js
import Core from './node_modules/jensen-js-essentials/src/Core.js';

var result = Core.roundDecimals(34.6816764, 2);
```

### Direct usage via CDN

```js
<script type="module">
import Core from '//cdn.jsdelivr.net/gh/winternet-studio/jensen-js-essentials@1.2.0/src/Core.js';

var result = Core.roundDecimals(34.6816764, 2);
</script>
```


## Testing

Run tests: `npm test`

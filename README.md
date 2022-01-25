# @seismic/icons

This is a public Seismic package containing all the icons in our design system.

## Usage

To use, import icon component from the package:

```js
import { IconCalculator } from '@seismic/icons'
```

And use like you use any icon:

```html
<IconCalculator class="w-4 h-4"/>
```

## Building

To build icon components, load new icons to ./src/icons and run:

```
yarn run build
```

This will create the icons in `./dist` folder.

## Publishing

Before publishing, run publish command with `--dry-run` to ensure everything will work as expected:

```
yarn publish --dry-run
```

To publish package to NPM, run:

```
yarn publish
```

Please note you **must** be logged in NPM registry to publish the package.

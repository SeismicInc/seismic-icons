# seismic-icons

## To generate or update components, load new icons to ./src/icons and run
```
node ./format-icons-to-components.js
```


## Tell Vue CLI that you want this project built as a library

```
npm run build
```

## Builds the library before publishing to npm; points to `build` script above

```
npm run prepublishOnly
```

## To import all components from library in your Nuxt project - add this path to your nuxt.config.js

```
components: [
  ...
  {
    path: '~/node_modules/seismic-icons/src/components',
  },
],
```
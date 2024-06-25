# fund-kit-demo

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

To customize the configuration, you can modify the Vite config file. Here's an example of how to inject specific globals and modules using the `@rollup/plugin-inject` plugin:

```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      nightwatchPlugin({
        renderPage: './nightwatch/index.html'
      }),
      vueDevTools(),
      inject({
        process: 'process/browser',
        querystring: 'querystring-es3'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        process: 'process/browser',
        querystring: 'querystring-es3'
      }
    }
  })
}
```

<vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'>This</vscode_annotation> configuration includes the @rollup/plugin-inject to inject global variables or modules, which is particularly useful for ensuring compatibility with certain dependencies in the browser.

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chrome
pnpm test:e2e --env chrome
# Runs the tests of a specific file
pnpm test:e2e tests/e2e/example.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)

```sh
pnpm test:unit
pnpm test:unit -- --headless # for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

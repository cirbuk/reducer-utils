# jslib-scaffolding

Scaffoling for setting up an open source libarary with the following stack

* code in JS/TypeScript
* Build with Rollup
* Test with Jest
* Publish to npm with CircleCI

For the discussion below, assume that the code resides in the `src` folder and the entry point is `index.ts`/`index.ts`.

## package.json

* Change the following fields `name`, `version`, `description`, `repository`, `author`, `license`, `bugs.url` and `homepage` as required
* Change/remove [`main`](https://github.com/rollup/rollup/wiki/pkg.module) as per requirement.
* Change/remove [`module`](https://github.com/rollup/rollup/wiki/pkg.module) as per requirement.
* Change/remove [`browser`](https://github.com/rollup/rollup/wiki/pkg.module) as per requirement.
* Run `npm install`
* Add additional packages required by the library

## Typescript

* `types` in `package.json` should point to the types declaration file generated for the library.
* Write code in `index.ts` in `src` folder
* Change the `tsconfig.json` file as required
* Change all `input` in `rollup.config.js` to `src/index.ts`

## JavaScipt

* Remove `types` and packages related to TypeScript from `devDependencies` in `package.json`
* Remove `tsconfig.json`
* Remove the entry `@babel/preset-typescript` from `.babelrc`
* Write code in `index.ts` in `src` folder
* Remove `import typescript from 'rollup-plugin-typescript';` in `rollup.config.js`
* Remove `typescript()` call from `plugins` in `rollup.config.js`
* Change all `input` in `rollup.config.js` to `src/index.ts`

> If you have other rollup built libraries as dependencies, and you use some named exports from those libraries,
> these imports will have to be explicitly declared in your rollup.config.js as [named exports](https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports).
> If these dependencies are peer dependencies, you can mark them as [external](https://rollupjs.org/guide/en/#peer-dependencies) in your rollup.config.js and avoid having to 
> declare all named imports. 

## Build

`npm run build` will build the library

## Tests

* Write your tests in the `tests` directory as files ending in `.test.js`
* Change the Jest config as required in `jest.config.js`
* `npm test` will run the tests and print the results

## Publish

* Login into Circle CI and follow the github project where the library resides
* Do `npm login` in local and extract the auth token from `${HOME}/.npmrc`
* Create an environment variable `npm_TOKEN` in Circle CI under project settings and paste the copied auth token as it's value
* Create an environment vairable `RELEASE_DIR`
* Change the node version in `.circleci/config.yml` if required

Once all the above steps have been completed and the library is ready, commit to github.

* The tests will be run in CircleCI for every branch and tag
* Publish to npm will happen whenever a commit is tagged with `v${versionNumber}`. 

> Before tagging a commit for publish, make sure that the correct version number is updated in `package.json`

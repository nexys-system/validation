# Validation

[![Test Package](https://github.com/nexys-system/validation/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/validation/actions/workflows/test.yml)
[![Publish](https://github.com/nexys-system/validation/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/validation/actions/workflows/publish.yml)
[![NPM package](https://badge.fury.io/js/%40nexys%2Fvalidation.svg)](https://www.npmjs.com/package/@nexys/validation)
[![NPM package](https://img.shields.io/npm/v/@nexys/validation.svg)](https://www.npmjs.com/package/@nexys/validation)
[![Bundleophobia](https://badgen.net/bundlephobia/min/@nexys/validation)](https://bundlephobia.com/result?p=@nexys/validation)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

Simple, flexible and typesafe validation helpers

## Get started

`yarn add @nexys/validation`

```
import Validation, {Type, Utils} from '@nexys/validation';
```

## Examples

see [tests](https://github.com/nexys-system/validation/blob/master/src/main.test.ts)

* [simple](https://github.com/nexys-system/validation/blob/master/src/main.test.ts)
* [objects](https://github.com/nexys-system/validation/blob/master/src/object.test.ts)
  * [optional nested object](https://github.com/nexys-system/validation/blob/master/src/object.test.ts#L17)
* [arrays](https://github.com/nexys-system/validation/blob/master/src/array.test.ts)

## Koa example

```
import Router from 'koa-router';
import bodyParser from 'koa-body';
import Validation, { Utils as VU } from '@nexys/koa-validation';

const router = new Router();

router.post(
  '/update',
  bodyParser(),
  Validation.isShapeMiddleware({
    uuid: { extraCheck: VU.checkUuid },
    name: {}
  }),
  async ctx => {
    // now that the body has been validated this can be safely typed/cast to the expected type.
    // Note that the type should match the validation shape
    const { uuid, name }: { uuid: Uuid; name: string } = ctx.request.body;
    ctx.body = await myFunc(uuid, name);
  }
);


export default router.routes();
```

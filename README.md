# Validation

[![npm version](https://badge.fury.io/js/%40nexys%2Fvalidation.svg)](https://www.npmjs.com/package/@nexys/validation)
[![Test Package](https://github.com/nexys-system/validation/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/validation/actions/workflows/test.yml)
[![Publish](https://github.com/nexys-system/validation/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/validation/actions/workflows/publish.yml)

Simple, flexible and typesafe validation helpers

## Get started

`yarn add @nexys/validation`

```
import Validation, {Type, Utils} from '@nexys/validation';
```

## Examples

see [tests](https://github.com/nexys-system/validation/blob/master/src/main.test.ts)

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
    const { uuid, name }: { uuid: Uuid; name: string } = ctx.state.body;
    ctx.body = await myFunc(uuid, name);
  }
);


export default router.routes();
```

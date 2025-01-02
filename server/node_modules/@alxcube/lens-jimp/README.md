# Lens-Jimp

[Jimp](https://www.npmjs.com/package/jimp) driver for
[@alxcube/lens](https://www.npmjs.com/package/@alxcube/lens) library.

## Installation

```
npm i jimp @alxcube/lens @alxcube/lens-jimp
```

## Usage

### ES module syntax

```js
import { Adapter } from "@alxcube/lens-jimp";
import { distort } from "@alxcube/lens";

const sourceImage = await Adapter.createFromFile("path/to/image.png");
const { image } = await distort(sourceImage, "Arc", [90]);
const jimpInstance = image.getResource();
jimpInstance.write("path/to/result.png");
```

You can only import "@alxcube/lens-jimp" for side-effect. It will register Jimp adapter factory in Lens, so you can
pass Jimp instances to `distort()` function:

```js
import "@alxcube/lens-jimp"; // Registers Jimp adapter factory in Lens.
import Jimp from "jimp";
import { distort } from "@alxcube/lens";

const sourceImage = await Jimp.read("path/to/image.png");
const { image } = await distort(sourceImage, "Arc", [90]);
const jimpInstance = image.getResource();
jimpInstance.write("path/to/result.png");
```

## CommonJs syntax

```javascript
const { distort } = require("@alxcube/lens");
const Jimp = require("jimp");
const { Adapter } = require("@alxcube/lens-jimp");

Adapter.createFromFile("path/to/image.png")
  .then((image) => {
    return distort(image, "Arc", [90]);
  })
  .then((result) => result.image.getResource())
  .then((jimp) => {
    return jimp.write("path/to/result.png"); // save result
  });
```

You can only require "@alxcube/lens-jimp" for side-effect. It will register jimp adapter factory in Lens, so you can
pass Jimp instances to `distort()` function:

```javascript
const { distort } = require("@alxcube/lens");
const Jimp = require("jimp");
require("@alxcube/lens-jimp"); // Registers Jimp adapter factory in Lens.

Jimp.read("path/to/image.png")
  .then((image) => {
    return distort(image, "Arc", [90]);
  })
  .then((result) => result.image.getResource())
  .then((jimp) => {
    return jimp.write("path/to/result.png"); // save result
  });
```

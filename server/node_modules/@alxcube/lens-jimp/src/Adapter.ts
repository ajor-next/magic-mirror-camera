/* Copyright 2020-2022 Alexander Alexandrov (alxcube) <alxcube@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import {
  AbstractImageAdapter,
  type ImageAdapter,
  type Color,
} from "@alxcube/lens";
import Jimp from "jimp";

/**
 * Lens image adapter for Jimp library
 */
export class Adapter
  extends AbstractImageAdapter<Jimp>
  implements ImageAdapter<Jimp>
{
  /**
   * Image resource
   */
  protected image: Jimp;

  /**
   * Creates instance from image file path
   *
   * @param path Image file path
   */
  static createFromFile(path: string): Promise<Adapter> {
    return Jimp.read(path).then((image) => new Adapter(image));
  }

  /**
   * @param image Jimp image resource object
   */
  constructor(image: Jimp) {
    super(image.bitmap.width, image.bitmap.height);
    this.image = image;
  }

  /**
   * @inheritDoc
   */
  getPixelColor(x: number, y: number): Color {
    const { r, g, b, a } = Jimp.intToRGBA(this.image.getPixelColor(x, y));
    return [r, g, b, a];
  }

  /**
   * @inheritDoc
   */
  setPixelColor(x: number, y: number, color: Color): void {
    this.image.setPixelColor(
      Jimp.rgbaToInt(color[0], color[1], color[2], color[3]),
      x,
      y
    );
  }

  /**
   * @inheritDoc
   */
  getAverageColor(): Color {
    const px = this.image.clone().resize(1, 1);
    return Array.prototype.slice.call(px.bitmap.data) as unknown as Color;
  }

  /**
   * @inheritDoc
   */
  protected resize(width: number, height: number): Adapter {
    const resized = this.image.clone().resize(width, height);
    return new Adapter(resized);
  }

  /**
   * @inheritDoc
   */
  protected prepareBlank(width: number, height: number): Adapter {
    return new Adapter(new Jimp(width, height, 0x0));
  }

  /**
   * @inheritDoc
   */
  getResource(): Jimp {
    return this.image;
  }

  /**
   * @inheritDoc
   */
  commit(): void {
    return;
  }
}

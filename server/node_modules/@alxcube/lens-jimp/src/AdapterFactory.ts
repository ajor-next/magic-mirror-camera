import Jimp from "jimp";
import type { ImageAdapter, ImageAdapterFactory } from "../../lens";
import { Adapter } from "./Adapter";

/**
 * Jimp ImageAdapter factory class.
 */
export class AdapterFactory implements ImageAdapterFactory<Jimp> {
  /**
   * @inheritDoc
   */
  match(resource: unknown): boolean {
    return resource instanceof Jimp;
  }

  /**
   * @inheritDoc
   */
  create(resource: Jimp): ImageAdapter<Jimp> {
    return new Adapter(resource);
  }
}

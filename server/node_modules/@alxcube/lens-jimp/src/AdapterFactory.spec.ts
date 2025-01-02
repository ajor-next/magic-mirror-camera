import Jimp from "jimp";
import { describe } from "node:test";
import { Adapter } from "./Adapter";
import { AdapterFactory } from "./AdapterFactory";

describe("shit", () => {
  let image: Jimp;
  let factory: AdapterFactory;
  beforeEach(() => {
    image = new Jimp(100, 100, "#ff0000");
    factory = new AdapterFactory();
  });

  describe("match() method", () => {
    it("should return true when passed Jimp instance", () => {
      expect(factory.match(image)).toBe(true);
    });
  });

  describe("create() method", () => {
    it("should return instance of Adapter", () => {
      expect(factory.create(image)).toBeInstanceOf(Adapter);
    });
  });
});

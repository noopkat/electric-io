import { mixHsv, ilerp } from "../colorInterpolation";

describe("colorInterpolation", () => {
  describe("mixHsv", () => {
    it("returns the start color when the factor is 0.0", () => {
      const a = { h: 120.0, s: 0.4, v: 0.9, a: 1.0 };
      const b = { h: 220.0, s: 0.9, v: 0.4, a: 1.0 };
      const actual = mixHsv(a, b, 0.0);
      expect(actual).toEqual(a);
    });

    it("returns the end color when the factor is 1.0", () => {
      const a = { h: 120.0, s: 0.4, v: 0.9, a: 1.0 };
      const b = { h: 220.0, s: 0.9, v: 0.4, a: 1.0 };
      const actual = mixHsv(a, b, 1.0);
      expect(actual).toEqual(b);
    });

    it("returns the start color when the factor is less than 0.0", () => {
      const a = { h: 120.0, s: 0.4, v: 0.9, a: 1.0 };
      const b = { h: 220.0, s: 0.9, v: 0.4, a: 1.0 };
      const actual = mixHsv(a, b, -42.0);
      expect(actual).toEqual(a);
    });

    it("returns the end color when the factor is greater than 1.0", () => {
      const a = { h: 120.0, s: 0.4, v: 0.9, a: 1.0 };
      const b = { h: 220.0, s: 0.9, v: 0.4, a: 1.0 };
      const actual = mixHsv(a, b, 5.0);
      expect(actual).toEqual(b);
    });

    it("interpolates clockwise between 350 and 10 degrees", () => {
      const a = { h: 350.0, s: 1.0, v: 1.0, a: 1.0 };
      const b = { h: 10.0, s: 1.0, v: 1.0, a: 1.0 };
      const actual = mixHsv(a, b, 0.5);
      expect(actual.h).toEqual(0.0);
    });

    it("interpolates counterclockwise between 10 and 350 degrees", () => {
      const a = { h: 10.0, s: 1.0, v: 1.0, a: 1.0 };
      const b = { h: 350.0, s: 1.0, v: 1.0, a: 1.0 };
      const actual = mixHsv(a, b, 0.5);
      expect(actual.h).toEqual(0.0);
    });
  });

  describe("ilerp", () => {
    it("returns 0.0 when the value equals the min argument", () => {
      expect(ilerp(23.0, 66.0, 23.0)).toEqual(0.0);
    });

    it("returns 1.0 when the value equals the max argument", () => {
      expect(ilerp(23.0, 66.0, 66.0)).toEqual(1.0);
    });

    it("returns 0.5 when the value equals the midpoint between the min and max arguments", () => {
      expect(ilerp(23.0, 66.0, 44.5)).toEqual(0.5);
    });

    it("returns 2.0 when the value is twice as far from the min argument as it is from the max argument", () => {
      expect(ilerp(23.0, 66.0, 109.0)).toEqual(2.0);
    });
  });
});

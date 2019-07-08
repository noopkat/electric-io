import colorContrastCheck from "../colorContraster";

describe("colorContrast checker", () => {
  describe("with color names", () => {
    test("Return dark colour given light", () => {
      expect(colorContrastCheck("papayawhip", "white", "black")).toBe("black");
    });

    test("Return light colour given dark", () => {
      expect(colorContrastCheck("purple", "white", "black")).toBe("white");
    });
  });

  describe("with hex colours", () => {
    test("Return dark colour given light", () => {
      expect(colorContrastCheck("#ffefd5", "white", "black")).toBe("black");
    });
    
    test("Return dark color given light (short hex code)", () => {
      expect(colorContrastCheck("#fed", "white", "black")).toBe("black");
    });

    test("Return light colour given dark", () => {
      expect(colorContrastCheck("#800080", "white", "black")).toBe("white");
    });
    
    test("Return light color given dark (short hex code)", () => {
      expect(colorContrastCheck("#352", "white", "black")).toBe("white");
    });
  });

  describe("with rgb color", () => {
    test("Return dark colour given light", () => {
      expect(colorContrastCheck("rgb(255,239,213)", "white", "black")).toBe(
        "black"
      );
    });

    test("Return light colour given dark", () => {
      expect(colorContrastCheck("rgb(128,0,128)", "white", "black")).toBe(
        "white"
      );
    });
  });

  test("with no colours passed in", () => {
    expect(colorContrastCheck()).toBe("#000000");
  });
});

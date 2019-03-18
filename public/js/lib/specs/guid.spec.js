import guid from "../guid";

describe("guid generator", () => {
  test("New guid generated on 10 attempts", () => {
    let testGuids = [];
    for (let test = 0; test <= 10; test++) {
      const newGuid = guid();
      expect(testGuids.includes(newGuid)).toBeFalsy();
      testGuids.push(newGuid);
    }
  });
});

import { evaluatePath, pathIsValid } from "../messagePropertyEvaluation.js";

describe("evaluatePath", () => {
  const complexMessageBody = {
    simpleProperty: 1,
    objectProperty: {
      int: 2,
      arr: [3],
      obj: {
        value: 4
      }
    },
    arrayProperty: [5, { value: 6 }]
  };

  test("Returns null with empty path", () => {
    const value = evaluatePath("", complexMessageBody);
    expect(value).toBeNull();
  });

  test("Returns null with invalid path", () => {
    const value = evaluatePath(
      "ceci nest pas une jmespath",
      complexMessageBody
    );
    expect(value).toBeNull();
  });

  test("Returns null with undefined property", () => {
    const value = evaluatePath("nonexistentProperty", complexMessageBody);
    expect(value).toBeNull();
  });

  test("Returns null with undefined array index", () => {
    const value = evaluatePath("arrayProperty[1234]", complexMessageBody);
    expect(value).toBeNull();
  });

  test("Evaluates 'simpleProperty'", () => {
    const value = evaluatePath("simpleProperty", complexMessageBody);
    expect(value).toEqual(1);
  });

  test("Evaluates 'objectProperty.int'", () => {
    const value = evaluatePath("objectProperty.int", complexMessageBody);
    expect(value).toEqual(2);
  });

  test("Evaluates 'objectProperty.arr[0]'", () => {
    const value = evaluatePath("objectProperty.arr[0]", complexMessageBody);
    expect(value).toEqual(3);
  });

  test("Evaluates 'objectProperty.obj.value'", () => {
    const value = evaluatePath("objectProperty.obj.value", complexMessageBody);
    expect(value).toEqual(4);
  });

  test("Evaluates 'arrayProperty[0]'", () => {
    const value = evaluatePath("arrayProperty[0]", complexMessageBody);
    expect(value).toEqual(5);
  });

  test("Evaluates 'arrayProperty[1].value'", () => {
    const value = evaluatePath("arrayProperty[1].value", complexMessageBody);
    expect(value).toEqual(6);
  });
});

describe("pathIsValid", () => {
  test("returns true for empty path", () => {
    expect(pathIsValid("")).toEqual(true);
  }),

  test("returns false for '['", () => {
    expect(pathIsValid("[")).toEqual(false);
  });

  test("returns false for 'prop.'", () => {
    expect(pathIsValid("prop.")).toEqual(false);
  });
});

const fs = require("fs");

const createDashboardFileIfItDoesNotExist = require("./createDashboardFileIfItDoesNotExist.js");

describe("createDashboardFileIfItDoesNotExist", () => {
  test("resolves if dashboard file already exists", async () => {
    jest.spyOn(fs, "open").mockImplementation((_path, _flags, callback) => {
      const error = {
        name: "Error",
        message: "EEXIST: file already exists",
        code: "EEXIST"
      };
      const fileDescriptor = 0;
      callback(error, fileDescriptor);
    });

    jest.spyOn(fs, "close").mockImplementation((_fileDescriptor, callback) => {
      const error = {
        name: "Error",
        message: ""
      };
      callback(error);
    });

    const result = await createDashboardFileIfItDoesNotExist();

    expect(result.fileCreated).toBe(false);
  });

  test("rejects on open errors that are not EEXIST", async () => {
    const fsOpenError = {
      name: "Error",
      message: "ENOENT: file does not exist",
      code: "ENOENT"
    };

    jest.spyOn(fs, "open").mockImplementation((_path, _flags, callback) => {
      const fileDescriptor = undefined;
      callback(fsOpenError, fileDescriptor);
    });

    try {
      await createDashboardFileIfItDoesNotExist();
    } catch (error) {
      expect(error).toEqual(fsOpenError);
    }
  });

  test("creates dashboard file if it doesn’t exist and resolves", async () => {
    jest.spyOn(fs, "open").mockImplementation((_path, _flags, callback) => {
      const error = undefined;
      const fileDescriptor = undefined;
      callback(error, fileDescriptor);
    });

    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((_path, _data, _options, callback) => {
        callback(undefined);
      });

    const result = await createDashboardFileIfItDoesNotExist();

    expect(result.fileCreated).toBe(true);
  });

  test("rejects if dashboard file doesn’t exist and can’t be created", async () => {
    jest.spyOn(fs, "open").mockImplementation((_path, _flags, callback) => {
      const error = undefined;
      const fileDescriptor = undefined;
      callback(error, fileDescriptor);
    });

    const fsWriteFileError = {};

    jest
      .spyOn(fs, "writeFile")
      .mockImplementation((_path, _data, _options, callback) => {
        callback(fsWriteFileError);
      });

    try {
      await createDashboardFileIfItDoesNotExist();
    } catch (error) {
      expect(error).toEqual(fsWriteFileError);
    }
  });
});

import * as configuration from "../configuration";

describe("upgradeDashboard", () => {
  it("does not invoke migrations on an up-to-date dashboard", () => {
    const migration = jest.fn();
    const migrations = [migration, migration, migration];
    const dashboard = { version: 3 };

    configuration.upgradeDashboard(dashboard, migrations);

    expect(migration).not.toHaveBeenCalled();
  });

  it("invokes migrations in order", () => {
    const migrationsPerformed = [];
    const migration1 = jest.fn(() => migrationsPerformed.push(1));
    const migration2 = jest.fn(() => migrationsPerformed.push(2));
    const migration3 = jest.fn(() => migrationsPerformed.push(3));
    const migrations = [migration1, migration2, migration3];
    const dashboard = {};

    configuration.upgradeDashboard(dashboard, migrations);

    expect(migrationsPerformed).toEqual([1, 2, 3]);
    expect(dashboard.version).toEqual(3);
  });

  it("skips migrations already performed", () => {
    const migrationsPerformed = [];
    const migration1 = jest.fn(() => migrationsPerformed.push(1));
    const migration2 = jest.fn(() => migrationsPerformed.push(2));
    const migration3 = jest.fn(() => migrationsPerformed.push(3));
    const migrations = [migration1, migration2, migration3];
    const dashboard = { version: 2 };

    configuration.upgradeDashboard(dashboard, migrations);

    expect(migrationsPerformed).toEqual([3]);
    expect(dashboard.version).toEqual(3);
  });
});

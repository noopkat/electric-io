export function upgradeDashboard(dashboard, migrations = dashboardMigrations) {
  const storedVersion = dashboard.version || 0;
  const currentVersion = migrations.length;

  for (let i = storedVersion; i < currentVersion; ++i) {
    migrations[i](dashboard);
  }

  dashboard.version = currentVersion;
  return storedVersion < currentVersion;
}

const dashboardMigrations = [migrateDashboardVersion0To1];

/**
 * Migrate from dashboard version 0 to version 1:
 * - Number tile: added text color gradient properties
 */
function migrateDashboardVersion0To1(dashboard) {
  for (const tile of dashboard.tiles) {
    if (tile.type === "number") {
      tile.textColorMode = "single";
      tile.lowValue = 20.0;
      tile.lowTextColor = "#1282baff";
      tile.highValue = 40.0;
      tile.highTextColor = "#cb1475ff";
    }
  }
}

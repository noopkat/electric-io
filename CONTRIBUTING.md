# Contributing

Hey! Thanks for your interest in contributing to this project! I really appreciate that you’re here. 👏🌻

This page should get you up and running with how to run locally and how to adhere to this project’s style guide also.

1. [Installation](#installation)
   - [With a real Azure IoT Hub](#with-a-real-azure-iot-hub)
   - [With the device and hub simulator](#with-the-built-in-device-and-hub-simulator)
2. [Style guide](#style-guide)
   - [Tests](#tests)
   - [Mobile support](#mobile-support)
3. [Pull requests](#pull-requests)
   - [Avoiding merge conflicts](#merge-conflicts)
4. [Dashboard settings migrations](#dashboard-settings-migrations)

## Installation

When developing electric-io locally, you have two options for ensuring you can test your code with incoming data. You can use a real Azure IoT Hub for connecting to, or you can use the ready made simulator instead.

### With a real Azure IoT Hub

You’ll need to have an Azure IoT Hub instance of your own running in Azure, as this is what the dashboard is designed for. If you’d like to see more IoT messaging providers, let me know by [opening an issue](https://github.com/noopkat/electric-io/issues/new?title=Request+to+add+messaging+provider).

You’ll need to have your Azure IoT Hub connection string handy. You can find it under your “Shared Access Policies” section in the IoT Hub’s Azure Portal blade. Choose a policy that allows “registry read”, “service connect” and “device connect” at the least.

You can also list your connections strings [via the command line](https://docs.microsoft.com/en-us/cli/azure/iot/hub?view=azure-cli-latest#az-iot-hub-show-connection-string)!

**Now you’re ready to install the app.**

1. Install [NodeJS](https://nodejs.org). You can see the recommended version in the “engines” entry in package.json.
2. Install [Git](https://git-scm.org).
3. Open your terminal and do the following:

   1. Clone the [electric-io repository](https://github.com/noopkat/electric-io):

      ```
      git clone https://github.com/noopkat/electric-io.git
      ```

      If this fails with an error message, you can [have a look at GitHub HTTPS cloning errors](https://help.github.com/articles/https-cloning-errors/).

   2. Navigate to the electric-io directory:

   ```
   cd electric-io
   ```

   3. Install electric-io’s dependencies:

      ```
      npm install
      ```

      If this fails with an error message, you can [have a look at common NPM errors](https://docs.npmjs.com/common-errors).

4. Open the file `.env` and fill in the `CONNECTION_STRING` property with your Azure IoT Hub connection string.
5. Optional. Specify the `CONSUMER_GROUP` in `.env`. _If in doubt, you can skip this step_.
6. Go back to your terminal and start electric-io:

   ```
   npm start
   ```

7. Navigate to `http://localhost:3000` in your favourite modern browser and away you go! Try adding new cards via the settings pane on the right and click “edit” to fill in the details.

### With the built in device and hub simulator

This application also features a simulator that features three “devices” that send JSON payloads to a fake “hub” running locally.

1. Follow steps 1–3 from above.
2. Navigate to the `.data` directory where you’ll note a file called `dashboard.example.json`. Copy this file to the same directory and name it `dashboard.json`. This will set you up with a pre-made dashboard layout with some cards already listening to data from the simulated devices 😎
3. In your terminal, run:

   ```
   SIMULATING=true npm start
   ```

   On Windows, run `set SIMULATING=true`, then run `npm start`.

4. Navigate to `http://localhost:3000` in your favourite modern browser and away you go!

#### The three simulated devices are as follows:

Device Id: `AZ3166`
Send frequency: ~1 second

Example payload:

```json
{
  "temperature": 25.8976,
  "humidity": 40.679
}
```

〰️〰️〰️〰️〰️〰️

Device Id: `Tessel2`
Send frequency: ~1 second

Example payload:

```json
{
  "light": 0.45689,
  "sound": 0.23878
}
```

〰️〰️〰️〰️〰️〰️

Device Id: `Jenn`
Send frequency: ~10 seconds

Example payload:

```json
{
  "coolness": 98.56
}
```

## Style guide

ESLint is installed by default with this repository, and many IDEs will automatically “fix” your code to match the expected style. Don’t worry if your editor doesn’t do this as there is also a git pre-commit hook that will run the linter when you commit.

This said, some caveats remain in order to keep this approachable:

- Target NodeJS 10+
- Stick to plain CSS. SASS/SCSS is probably a little much for this project anyway.
- Idiomatic Vue style. This is way less scary than it might sound. Please keep things looking like the documentation. 🌻

If you want a build toolchain for doing extra things like SASS or Vue related transpiling, go for it! But please do this in your own fork and keep it as your own project rather than trying to change this one 💜

### Tests

[Jest](https://facebook.github.io/jest/) 🃏 is used for testing, and the tests are saved beside the code being tested, in a folder called `specs`. **Vue Test Utils** is used to help make testing the Vue components easier and it has lots of [documentation](https://vue-test-utils.vuejs.org/) to help you out.

There is some coverage already, but not quite enough, so please add some more tests. Writing tests is very good for your wellbeing 😉, and maybe you’ll find a little bug to fix! 🐛

### Mobile support

Mobile support for this app is not great at the moment. I’d suggest the following if you want to help make it more responsive:

1. Make every card stack one underneath each other so the user can scroll down and view them that way.
2. Larger “edit” and “delete” buttons on mobile.
3. Settings can be an expandable menu item (really this should be a thing for the desktop version)

Some ideas ✨ Add your own if you geek out about mobile responsive designs!

## Pull requests

PRs are welcomed, and you will find lots of support from the Noopkat family if you’re not sure about how to approach something. Issues marked [Help Wanted](https://github.com/noopkat/electric-io/labels/help%20wanted) or [Good First Issue](https://github.com/noopkat/electric-io/labels/good%20first%20issue) would be good starting points.

The easiest way to review a pull request for a project maintainer is by submitting a pull request from a copy of the remote repository (usually called “fork”). In most cases, you won’t have the permission to push your changes directly to the project when contributing to open source software.

While on the Github webpage for this repository, you should see a “fork” button. Please fork this repo. From this online copy (fork), you can create pull requests if you push commits to it.

Clone your new fork to your computer with: `git clone --origin fork <your fork’s url>`

Then, check out a new branch with `git checkout -b my-branch-name`

Create your code / documentation changes in this branch, and commit when done. Once done, `git push fork your-branch-name`

Once this is finished pushing, you can go to your fork on GitHub. It should now ask you right away if you want to create a pull request. Clicking that button should set you up with a text field similar to when creating a new issue on GitHub. Fill it out and submit the pull request. Then, we can review it “Pull requests” in this original repository.

### Merge Conflicts

There are times where, after seeing a very good contribution, there are some really confusing merge conflicts. This can be very frustrating for maintainers, who may not understand how to resolve a variety of merge conflicts you and/or others introduced.

Making sure your PR is kept up-to-date will help avoid merge conflicts - the following steps will help:

```sh
# do this once only
git remote add upstream https://github.com/noopkat/electric-io.git

# do regularly
git checkout master
git fetch upstream master
git checkout <your-development-branch>
git merge master
```

This will:

- Switch to your own `master` branch
- Download changes from the primary repository `noopkat/electric-io`
- Switch back to your `feature/...` or `issue/...` branch
- Merge changes into your branch

You can then `git push` to update the PR if you’ve already submitted one.

✨✨✨ Happy Contributing!! ✨✨✨

## Dashboard settings migrations

If you change the structure of the dashboard settings in a way that would prevent an existing dashboard from loading correctly, you should add a migration.

Dashboard migrations are functions in the `dashboardMigrations` array in `lib/services/dashboard-migrations.service.js`. Each function in this array corresponds to a new dashboard version.

The value of the dashboard `version` property is an integer corresponding to the number of migrations in the array of all dashboard migrations. An upgrade is required if the dashboard version is lower than the number of migrations in this array. When the server starts, it checks the `version` property and upgrades the dashboard if necessary. (A dashboard with no version property is at version `0`.)

For example, say the dashboard is at version `2` and there are four functions in the migrations array. This means the dashboard is two versions behind. The upgrade runs the two last functions in the migrations array and sets the dashboard version to `4`.

### Adding a dashboard migration

To add a dashboard migration, write a function that performs the migration and **append** it to the array of migrations in `dashboard-migrations.service.js`. This function should have one parameter, the dashboard settings object, and modify it so that the dashboard will load correctly in the current version. Always use sensible defaults to avoid showing users broken or surprising behaviour.

Do not forget to update the blank and default dashboard settings files in the `.data` directory if necessary.

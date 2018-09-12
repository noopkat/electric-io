# Contributing

Hey thanks for your interest in contributing to this project! I really appreciate that you're here 👏🌻

This page should get you up and running with how to run locally and how to adhere to this project's style guide also.

1. [Installation](#installation)
   1. [With a real Azure IoT Hub](#with-a-real-azure-iot-hub)
   2. [With the device and hub simulator](#with-the-built-in-device-and-hub-simulator)
2. [Style Guide](#style-guide-for-contributing-code)

## Installation

When developing electric-dreams locally, you have two options for ensuring you can test your code with incoming data. You can use a real Azure IoT Hub for connecting to, or you can use the ready made simulator instead.

### With a real Azure IoT Hub

You'll need to have your Azure IoT Hub connection string handy. You can find it under your 'Shared Access Policies' section in the IoT Hub's Azure Portal blade. Choose a policy that allows 'registry read', 'service connect' and 'device connect' at the least.

You can also list your connections strings [via the command line](https://docs.microsoft.com/en-us/cli/azure/iot/hub?view=azure-cli-latest#az-iot-hub-show-connection-string)!

**Now you're ready to install the app.**

1. Install [NodeJS](https://nodejs.org)
2. Install [git](https://git-scm.org)
3. Open your [terminal](https://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything) and run the following commands:

   1. `git clone https://github.com/noopkat/electric-io.git && cd electric-io`
   2. `npm install`

4. Open the file `.env` in and fill in the `CONNECTION_STRING` property with your Azure IoT Hub connection string.
5. Optional - specify the `CONSUMER_GROUP` in `.env`. _If you don't know what this is, you can skip this step_.
6. In your terminal, run `npm start` from this project's root directory.
7. Navigate to `http://localhost:3000` in your favourite modern browser and away you go!

### With the built in device and hub simulator

This application also features a simulator that features three 'devices' that send JSON payloads to a fake 'hub' running locally.

1. Install [NodeJS](https://nodejs.org)
2. Install [git](https://git-scm.org)
3. Open your [terminal](https://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything) and run the following commands:
   1. `git clone https://github.com/noopkat/electric-io.git && cd electric-io`
   2. `npm install`
4. Navigate to the `.data` directory where you'll note a file called `dashboard.json.sim`. Copy this file to the same directory and name it `dashboard.json`. This will set you up with a pre-made dashboard layout with some cards already listening to data from the simulated devices 😎
5. In your terminal, run `SIMULATING=true npm start` from this project's root directory.
   - On Windows, run `set SIMULATING=true`, then run `npm start`.
6. Navigate to `http://localhost:3000` in your favourite modern browser and away you go!

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

## Code Style

ESLint is installed by default with this repository, and many IDEs will automatically "fix" your code to match the expected style. Don't worry if your editor doesn't do this as there is also a git pre-commit hook that will run the linter when you commit.

This said, some caveats remain in order to keep this approachable:

1. Target NodeJS 4+ - no async/await etc.
2. Stick to plain CSS. SASS/SCSS is probably a little much for this project anyway.
3. Idiomatic Vue style. This is way less scary than it might sound - just keep things looking like the documentation. 🌻

If you want a build toolchain for doing extra things like SASS or Vue related transpiling, go for it! But please do this in your own fork and keep it as your own project rather than trying to change this one 💜

### Tests

[Jest](https://facebook.github.io/jest/) 🃏 is used for testing, and the tests are saved beside the code being tested, in a folder called `specs`. **Vue Test Utils** is used to help make testing the Vue components easier and it has lots of [documentation](https://vue-test-utils.vuejs.org/) to help you out.

There is not much coverage yet, so please add some more tests. Writing tests is very good for your welbeing 😉, and maybe you'll find a little bug to fix! 🐛

### Mobile support

Mobile support for this app is not great at the moment. I'd suggest the following if you want to help make it more responsive:

1. Make every card stack one underneath each other so the user can scroll down and view them that way.
2. Larger 'edit' and 'delete' buttons on mobile.
3. Settings can be an expandable menu item (really this should be a thing for the desktop version)

Just some ideas ✨ Add your own if you geek out about mobile responsive designs!

## Pull Requests

PRs are welcomed, and you will find lots of support from the Noopkat family if you're not sure about how to approach something. Issues marked [Help Wanted](https://github.com/noopkat/electric-io/labels/help%20wanted) or [Good First Issue](https://github.com/noopkat/electric-io/labels/good%20first%20issue) would be good starting points.

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

You can then `git push` to update the PR if you've already submitted one.

✨✨✨ Happy Contributing!! ✨✨✨

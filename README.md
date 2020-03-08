# electric-io

The cutest IoT dashboard of your dreams ☁️

![screenshot of electric io dashboard](screenshot.png)

Built with:

- [Glitch](https://glitch.com)
- [Vue](https://vuejs.org)
- [Chartist](https://gionkunz.github.io/chartist-js/)
- [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub)
- [Love](https://media.giphy.com/media/26ufcYAkp8e66vanu/giphy.gif) ❤️

## Sections

- [Installation](#installation)
- [How to send the right data](#how-to-send-the-right-data)
- [Types of cards and their settings](#types-of-cards-and-their-settings)
- [Locking your dashboard](#locking-your-dashboard)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Code of conduct](#code-of-conduct)

## Installation

This will be remixable on Glitch pretty soon, but if you want to run it locally you can!

You’ll need to have an Azure IoT Hub instance of your own running in Azure, as this is what the dashboard is designed for. If you’d like to see more IoT messaging providers, let me know by [opening an issue](https://github.com/noopkat/electric-io/issues/new?title=Request+to+add+messaging+provider).

You’ll need to have your Azure IoT Hub connection string and Event Hub-compatible endpoint connection string handy.

- You can find your Iot Hub connection string under the “Shared Access Policies” section in the IoT Hub’s Azure Portal blade. Choose a policy that allows “registry read”, “service connect” and “device connect” at the least.

  You can also list your connections strings [via the command line](https://docs.microsoft.com/en-us/cli/azure/iot/hub?view=azure-cli-latest#az-iot-hub-show-connection-string).

- You can find your Event Hub-compatible endpoint connection string under the “Built-in endpoints” section in the IoT Hub's Azure Portal blade.

**Now you’re ready to install the app.**

We have two different ways you can do this. You can do this via the [native installation](#native-installation) method below, or you can [use Docker, mentioned a bit lower](#docker-installation).

### Native Installation

1. Install [NodeJS](https://nodejs.org). You can see the recommended version in the “engines” entry in package.json.
2. Install [Git](https://git-scm.org).
3. Open your terminal and do the following:

   1. Clone the [electric-io repository](https://github.com/noopkat/electric-io):

      ```
      git clone https://github.com/noopkat/electric-io.git
      ```

      If this fails with an error message, you can [have a look at GitHub HTTPS cloning errors](https://help.github.com/articles/https-cloning-errors/).

   2. Navigate to the electric-iodirectory:

      ```
      cd electric-io
      ```

   3. Install electric-io’s dependencies:

      ```
      npm install
      ```

      If this fails with an error message, you can [have a look at common NPM errors](https://docs.npmjs.com/common-errors).

4. Open the file `.env` in a text editor. Fill in the `IOTHUB_CONNECTION_STRING` property with your Azure IoT Hub connection string. Fill in the `EVENTHUB_CONNECTION_STRING` property with your Event Hub-compatible endpoint connection string.
5. Optional. Specify the `CONSUMER_GROUP` in `.env`. _If in doubt, you can skip this step_.
6. Go back to your terminal and start electric-io:

   ```
   npm start
   ```

7. Navigate to `http://localhost:3000` in your favourite modern browser and away you go! Try adding new cards via the settings pane on the right and click “edit” to fill in the details.

### Docker Installation

#### Install Docker

Docker is a container technology. There are native applications available for Windows and Mac. And Docker is fully supported on Linux. If you are in the latter group, this part of the guide is probably not for you. [You can get Docker for Mac, Windows, Linux right over here.](https://www.docker.com/community-edition)

#### Clone the electric-io repository

You can install GIT using the instructions in the Native installation section above.

```sh
git clone https://github.com/noopkat/electric-io.git && cd electric-io
```

#### Build and run this project

```sh
docker-compose up --build
```

You should now see log ouput. If you <kbd>Ctrl-C</kbd> this will stop the container. If you would rather run this in the background, and tail the container’s log output you can run the following

```sh
docker-compose up --build -d
docker logs -f electric-io
```

#### Build and run the project in simulating mode

The docker compose file has been configured to read from the .env file, or you can pass in your own override for whether to run in simulating mode with the following:

```sh
SIMULATING=true docker-compose up --build
```

#### Shut down the Docker Compose stack

```sh
docker-compose down
```

## How to send the right data

For this dashboard to work, all data payloads coming in from device to Azure IoT Hub should be in JSON format and properties should not be nested. If you’d like to see nested properties, [pull requests](#contributing) are very welcome! 😇

Example:

```json
{
  "humidity": 45.68,
  "temperature": 27.3
}
```

## Types of cards and their settings

### Button

This card will give you a big button to press that can map to any [device method](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods) active on your device! Pretty cool. You can’t send payloads yet, but that’s coming soon!

Fields:

- Title: Text displayed at the top of the card
- Device Id: The id of the device (from IoT Hub) that you want to call a method on
- Device Method Name: The name of the device method you want to call on your device
- Button text: The text you want your button to say, e.g. “turn on LED”

〰️〰️〰️〰️〰️〰️

### Line Chart

This card will plot the last 20 **numeric** values it received of the property you’re watching

Fields:

- Title: Text displayed at the top of the card
- Device Id: The id of the device (from IoT Hub) that you want to display telemetry for
- Data Property: The name of the device payload property you want to display the value of (eg. `humidity`)
- Line Color: The color you’d like the plotted line and points to be. Accepts `#00ff00`, `rgb(0,255,0)`, and `salmonpink` color formats 🌈

〰️〰️〰️〰️〰️〰️

### Number

This card will display the last value it received from a **numeric** property you’re watching

Fields:

- Title: Text displayed at the top of the card
- Device Id: The id of the device (from IoT Hub) that you want to display telemetry for
- Data Property: The name of the device payload property you want to display the value of (eg. `humidity`)
- Text Color: The color you’d like the number to be. Accepts `#00ff00`, `rgb(0,255,0)`, and `salmonpink` color formats 🌈

〰️〰️〰️〰️〰️〰️

### Sticker

This card will display a sticker on your dashboard.

Fields:

- Title: Text displayed at the top of the card
- Url: A full URL link to the picture you want to display on the sticker. GIFs will work! MJPEG streams are also supported. You may be able to install [mjpg-streamer](https://github.com/jacksonliam/mjpg-streamer) or [ffmpeg/ffserver](https://www.ffmpeg.org/ffserver.html) on your device (e.g. Raspberry Pi) to stream MJPEG via HTTP.

〰️〰️〰️〰️〰️〰️

### Text

The simplest of them all! This card will display text.

Fields:

- Title: Text displayed at the top of the card
- Text: Text to be displayed on the card. [Markdown syntax](https://guides.github.com/features/mastering-markdown/) is supported!

️〰️〰️〰️〰️〰️

Got ideas for more cards? Open an issue on this repo and let me know! 👀

## Transferring dashboard settings

electric-io saves your dashboard configuration to `./.data/dashboard.json`. To safely transfer this elsewhere, stop the source and destination electric-io instances and copy `dashboard.json` across.

```sh
# With both the source and destination electric-io instances stopped
cp ./electric-io-testing/.data/dashboard.json ./electric-io-production/.data/dashboard.json
```

On Windows:

```
xcopy electric-io-testing\.data\dashboard.json electric-io-production\.data\dashboard.json
# Choose F at the prompt to complete the copy
```

The transferred settings should show up when electric-io is started again.

## Locking your dashboard

A common thing you might want to do is to share your dashboard with folks without them changing things against your permission. If you’d like to temporarily “lock” your dashboard, place the following line in your `./.env` file:

```sh
EDIT_MODE=locked
```

This mode will show your cards and your telemetry, but won’t let them create, edit, delete, or drag cards around. The dashboard settings will also not be available.

This might also be handy for when you’re happy with how everything is and want the dashboard to look a little cleaner.

## Browser support

Electric-io will work in modern web browsers, and we aim for it to run on any released in the last 2 years. Support does not extend to any version of Internet Explorer 💀.

## Contributing

**We gladly accept contributions!**

If you’d like to contribute to this repo, please read the [Contributing guide](CONTRIBUTING.md).

## Code of conduct

To participate, please read and follow the [Contributor Code of Conduct](CODE_OF_CONDUCT.md) agreement.

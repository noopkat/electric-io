# electric-io

The cutest IoT dashboard of your dreams ☁️

![screenshot of electric io dashboard](screenshot.png)

Built with:

+ [Glitch](https://glitch.com)
+ [Vue](https://vuejs.org)
+ [Chart.js](http://www.chartjs.org/)
+ [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub)
+ [Love](https://media.giphy.com/media/26ufcYAkp8e66vanu/giphy.gif) ❤️

## Installation

This will be remixable on Glitch pretty soon, but if you want to run it locally you can!
You'll need to have an Azure IoT Hub instance of your own running in Azure, as this is what the dashboard is designed for. If you'd like to see more IoT messaging providers, let me know by opening an issue!

You'll need to have your Azure IoT Hub connection string handy. You can find it under your 'Shared Access Policies' section in the IoT Hub's Azure Portal blade. Choose a policy that allows 'registry read', 'service connect' and 'device connect' at the least. 

You can also list your connections strings [via the command line](https://docs.microsoft.com/en-us/cli/azure/iot/hub?view=azure-cli-latest#az-iot-hub-show-connection-string)!

**Now you're ready to install the app.**


1. Install [NodeJS](https://nodejs.org)
2. Install [git](https://git-scm.org)
3. Open your [terminal](https://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything) and run the following commands:
	1. `git clone https://github.com/noopkat/electric-io.git && cd electric-io`
	2. `npm install`
	3. `npm start`
4. Open the file `.env` in and fill in the `CONNECTION_STRING` property with your Azure IoT Hub connection string.
5. Optional - specify the `CONSUMER_GROUP` in `.env`. _If in doubt, you can skip this step_.
6. Navigate to `http://localhost:3000` in your favourite modern browser and away you go! Try adding new cards via the settings pane on the right and click 'edit' to fill in the details!

## How to send the right data

For this dashboard to work, all data payloads coming in from device to Azure IoT Hub should be in json format and properties should not be nested. If you'd like to see nested properties, pull requests are welcome! 😇

Example:

```json
{
  "humidity": 45.68,
  "temperature": 27.3
}
```


## Types of cards and their settings

### Sticker

The simplest of them all! You can display a sticker on your dashboard. 

Fields:

1. Title - text displayed at the top of the card
2. Url - a full url link to the picture you want to display on the sticker. GIFs will work!

〰️〰️〰️〰️〰️〰️

### Number

This card will display the last value it received from a **numeric** property you're watching

Fields:

1. Title - text displayed at the top of the card
2. Device Id - the id of the device (from IoT Hub) that you want to display telemetry for
3. Data Property - the name of the device payload property you want to display the value of (eg. `humidity`)
4. Text Color - the color you'd like the number to be. Accepts `#00ff00`, `rgb(0,255,0)`, and `salmonpink` color formats 🌈

〰️〰️〰️〰️〰️〰️

### Line Chart

This card will plot the last 20 **numeric** values it received of the property you're watching

Fields:

1. Title - text displayed at the top of the card
2. Device Id - the id of the device (from IoT Hub) that you want to display telemetry for
3. Data Property - the name of the device payload property you want to display the value of (eg. `humidity`)
4. Line Color - the color you'd like the plotted line and points to be. Accepts `#00ff00`, `rgb(0,255,0)`, and `salmonpink` color formats 🌈

〰️〰️〰️〰️〰️〰️

### Button

This card will give you a big button to press that can map to any device method active on your device! Pretty cool. You can't send payloads yet, but that's coming soon!

Fields:

1. Title - text displayed at the top of the card
2. Device Id - the id of the device (from IoT Hub) that you want to call a method on
3. Device Method Name - the name of the device method you want to call on your device
4. Button text - the text you want your button to say, eg. "turn on LED"
5. 

〰️〰️〰️〰️〰️〰️

Got ideas for more cards? Open an issue on this repo and let me know! 👀


## Contributing

If you'd like to contribute to this repo, please read the [contributing guide](https://github.com/noopkat/electric-io/blob/master/CONTRIBUTING.md)!





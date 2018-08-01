export default {
  sticker: {
    title: 'Sticker Time',
    type: 'sticker',
    url: 'https://i.giphy.com/lEnCWZXT4eHSg.gif',
    position: [0, 0],
    size: [1, 1],
    template: `
      <div>
        <label>Picture URL
          <input type="text" name="url" v-bind:value="tile.url"/>
        </label>
      </div>
    `
  },
  number: {
    title: 'Number',
    type: 'number',
    deviceId: '',
    textColor: '#000',
    property: '',
    position: [0, 0],
    size: [1, 1],
    template: `
      <div>
        <label>Device Id
          <select name="deviceId" id="deviceSelect" >
            <option v-for="device in deviceList" v-bind:selected="device===tile.deviceId">
              {{device}}
            </option>
        </select>
        </label>
        
        <label>Data Property
          <input type="text" name="property" v-bind:value="tile.property"/>
        </label>

        <label>Text Color
          <input type="text" name="textColor" v-bind:value="tile.textColor"/>
        </label>
      </div>
    `
  },
  button: {
    title: 'Cool Button',
    type: 'button',
    buttonText: 'Click Me',
    deviceId: '',
    deviceMethod: '',
    position: [0, 0],
    size: [0.8, 0.7],
    template: `
      <div>
        <label>Device Id
          <select name="deviceId" id="deviceSelect" >
              <option v-for="device in deviceList" v-bind:selected="device===tile.deviceId">
                {{device}}
              </option>
          </select>
        </label>
        
        <label>Method Name
          <input type="text" name="deviceMethod" v-bind:value="tile.deviceMethod"/>
        </label>
        
        <label>Button Text
          <input type="text" name="buttonText" v-bind:value="tile.buttonText"/>
        </label>
      </div>
   `
  },
  lineChart: {
    title: 'Line Chart',
    type: 'line-chart',
    lineColor: '#FF6384',
    deviceId: '',
    property: '',
    position: [0, 0],
    size: [2, 1.5],
    template: `
      <div>
        <label>Device Id
        <select name="deviceId" id="deviceSelect" >
            <option v-for="device in deviceList" :selected="device===tile.deviceId">
              {{device}}
            </option>
        </select>
        </label>
        
        <label>Data Property
          <input type="text" name="property" :value="tile.property"/>
        </label>
        
        <label>Line Color
          <input type="text" name="lineColor" :value="tile.lineColor"/>
        </label>
      </div>
    `
  },
  text: {
    title: 'Most Excellent Note',
    type: 'text',
    tileText: '# Hello!',
    position: [0, 0],
    size: [1.2, 1],
    template: `
      <div>
        <label>This supports <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">markdown</a>!
          <textarea name="tileText" :value="tile.tileText" ></textarea>
        </label>
      </div>
    `
  }
};

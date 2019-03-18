<template>
  <canvas v-bind:id="tile.id" v-bind:style="canvasStyle"> </canvas>
</template>

<script>
import Chart from "chart.js";
import chartOptions from "../lib/chartOptions.js";

export default {
  name: "line-chart-card",
  props: ["tile", "blockSize", "messages"],
  data: function() {
    return {
      ctx: this.tile.id,
      chart: null,
      chartOptions,
      chartData: {
        datasets: [
          {
            label: "",
            data: [],
            fill: false,
            borderColor: this.tile.lineColor,
            borderWidth: 3,
            pointBorderWidth: 2,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: this.tile.lineColor,
            lineTension: 0
          }
        ]
      }
    };
  },
  watch: {
    messages: function() {
      const prop = this.tile.property;
      const newData = this.messages
        .filter(msg => msg[prop])
        .splice(-20)
        .map(msg => ({ t: new Date(msg.enqueuedTime), y: msg[prop] }));
      this.chartData.datasets[0].data = newData;
      this.chart.update();
    }
  },
  computed: {
    canvasStyle: function() {
      return {
        width: `${this.blockSize[0] * this.tile.size[0] - 30}px`,
        height: `${this.blockSize[1] * this.tile.size[1] - 70}px`
      };
    }
  },
  mounted() {
    this.chart = new Chart(this.ctx, {
      type: "line",
      data: this.chartData,
      options: this.chartOptions
    });
    this.chart.update();
  }
};
</script>

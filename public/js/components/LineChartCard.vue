<template>
  <canvas :id="tile.id" :style="canvasStyle" />
</template>

<script>
import Chart from "chart.js";
import chartOptions from "../lib/chartOptions.js";
import { evaluatePath } from "../lib/messagePropertyEvaluation.js";

export default {
  name: "LineChartCard",

  props: {
    tile: {
      type: Object,
      required: true
    },
    blockSize: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
    }
  },

  data() {
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

  computed: {
    canvasStyle: function() {
      return {
        width: `${this.blockSize[0] * this.tile.size[0] - 30}px`,
        height: `${this.blockSize[1] * this.tile.size[1] - 70}px`
      };
    }
  },

  watch: {
    messages: function() {
      const propPath = this.tile.property;
      const newData = this.messages
        .map(msg => ({
          t: new Date(msg.enqueuedTime),
          y: evaluatePath(propPath, msg)
        }))
        .filter(msg => msg.y)
        .splice(-20);
      this.chartData.datasets[0].data = newData;
      this.chart.update();
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

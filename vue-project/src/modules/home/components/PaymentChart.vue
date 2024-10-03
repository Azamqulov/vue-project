<template>
  <div class="chart-container">
    <canvas ref="paymentStatsChart"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "PaymentStatsChart",
  props: {
    paymentStats: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    const createChart = () => {
      const ctx = chartRef.value.getContext("2d");
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(props.paymentStats),
          datasets: [
            {
              label: "O'quvchilar soni",
              data: Object.values(props.paymentStats),
              backgroundColor: "#42A5F5",
              borderColor: "#1E88E5",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "To'lov miqdori",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "O'quvchilar soni",
              },
            },
          },
        },
      });
    };
    watch(() => props.paymentStats, createChart, { immediate: true });
    onMounted(createChart);
    return {
      chartRef,
    };
  },
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>

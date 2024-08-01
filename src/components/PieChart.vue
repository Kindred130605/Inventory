<template>
    <div class="chart">
      <Pie :data="chartData" />
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default {
    components: {
      Pie,
    },
    props: {
      data: {
        type: Array,
        required: true,
      },
      label: {
        type: String,
        default: 'Chart',
      },
    },
    computed: {
      chartData() {
        const labels = this.data.map(item => item.item_name);
        const values = this.data.map(item => item.borrowed_quantity || item.damaged_quantity);
        return {
          labels,
          datasets: [
            {
              label: this.label,
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E57373', '#F06292'],
            },
          ],
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .chart{
    width: 95%;
    height: 95%;


  }
  </style>
  
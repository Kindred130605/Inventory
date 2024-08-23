<template>
  <div  class="chartdes">
    <Bar
      :chart-id="'bar-chart'"
      :dataset-id="'bar-dataset'"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {  
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  juniorHighData: Array,
  seniorHighData: Array,
});

const chartData = ref({
  labels: ['Total Items', 'Borrowed Items', 'Overdue Items', 'Damaged Items'],
  datasets: [
    {
      label: 'Junior High School',
      backgroundColor: '#42A5F5',
      data: props.juniorHighData,
    },
    {
      label: 'Senior High School',
      backgroundColor: '#FFA726',
      data: props.seniorHighData,
    },
  ],
});

watch(props, (newProps) => {
  chartData.value.datasets[0].data = newProps.juniorHighData;
  chartData.value.datasets[1].data = newProps.seniorHighData;
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>
<style>
.chartdes{
  width: 95%;
   height: 98%;
}

</style>
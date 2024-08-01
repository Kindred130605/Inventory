<template>
  <main>
    <div class="top-container">
      <h1 class="bg-title">DASHBOARD</h1>
      <div class="studentProfile">
          <span class="material-icons">grid_view</span>
          <span class="text fw-bolder">Dashboard</span>   
      </div>    
  </div> 
  <hr>

  <div class="bottom-container">

    <div class="student-table">
      <DashboardCom />
    </div>

    <div class="chart" >
      <h3><span class="material-icons">format_list_numbered</span>JHS and SHS Item Overview</h3>

      <div class="chartTB" v-if="hasChartData">
        
        <BarChart 
          :juniorHighData="juniorHighData"
          :seniorHighData="seniorHighData"
        />
      </div>

    </div>
  </div>
  </main>
</template>

<script>
import DashboardCom from '../components/DashboardCom.vue';
import BarChart from '../components/BarChart.vue';
import api from '../service/axiosApi';

export default {
  components: {
    DashboardCom,
    BarChart,
  },
  data() {
    return {
      juniorHighData: [], 
      seniorHighData: [], 
    };
  },
  computed: {
    hasChartData() {
      return this.juniorHighData.length > 0 && this.seniorHighData.length > 0;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await api.get('/dashboard');
        this.juniorHighData = Object.values(response.data.juniorHighInventory);
        this.seniorHighData = Object.values(response.data.seniorHighInventory);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.top-container{
  display: flex;
  margin: 0.5rem;

  .bg-title{
      z-index: -1;
      position: absolute;
      opacity: 10%;
      margin-top: -40px;
      font-size: 100px;
      font-family: Impact, fantasy;
  }
  .studentProfile{
      flex: 1;

      .material-icons{
          position: relative;
          color: var(--dark);
          font-size: 2rem;
          top: 4px;
      }
      .text{
          position: relative;
          color: var(--dark);
          font-size: 2.5rem;
          font-weight: 900;
          bottom: 0.1rem;
          left: 0.2rem;   
          text-shadow: 0 1px 1px;

      }
  }

} 
.studentProfile {
  flex: 1;

  .material-icons {
    color: var(--dark);
    font-size: 2.5rem;
  }
  .text {
    position: relative;
    color: var(--dark);
    font-size: 1.5rem;
    font-weight: 900;
    bottom: 0.5rem;
  }
}

.bottom-container {
  display: flex;
  padding: 0.5rem;

  .student-table {
    flex: 0.5;
    border-radius: 5px;
  }

.chart{
  flex: 0.5;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
  padding: 1.5rem;
  border-right: 6px solid var(--dark);
  color: var(--dark);
    h3 {
      text-shadow: 0 0 1px;
      font-size: 20px;
      position:relative;
      bottom: 15px;
  }
  .material-icons{
      position:relative;
      font-size: 35px;
      top: 12px;
      right: 2px;
  }
  .chartTB {
    width: 100%;
    height: 30rem;
  }
}

}

</style>

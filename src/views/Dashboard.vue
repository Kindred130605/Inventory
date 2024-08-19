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

    <div class="left">

        <div class="total-container">
          <h3><span class="material-icons">school</span>Student Total</h3>

          <v-card flat >
              <v-list-item >

                  <v-list-item-content>

                    <div class="total-equipment">
                      <div class="top">
                          <v-card-text  v-if="dashboardInfo.totals" >
                            <h2>Total Equipment Count:</h2>  <br> <h1> {{ dashboardInfo.totals.item_quantity}}</h1>
                          </v-card-text> 
                      </div>
                    
      
                      <div class="bottom">
                        <div class="per-item">
                          <v-card-text  v-if="dashboardInfo.totals" class="borrowed" >
                            <h5>Total Borrowed Items:</h5>  <br> <h4 style="color:green">{{ dashboardInfo.totals.borrowed_items}}</h4> 
                          </v-card-text> 
                          
                          <v-card-text  v-if="dashboardInfo.totals" class="overdue" >
                            <h5>Total Overdue Items:</h5>  <br> <h4 style="color: orange"> {{ dashboardInfo.totals.overdue_items}}</h4>
                          </v-card-text> 
                          
                          <v-card-text  v-if="dashboardInfo.totals" class="damaged">
                            <h5>Total Damage Items:</h5>   <br> <h4 style="color: red">{{ dashboardInfo.totals.damaged_items}}</h4>
                          </v-card-text> 
                        </div>
                      </div>
                    </div>
      
              </v-list-item-content>
              </v-list-item>
            </v-card> 
        </div>

    </div>
     
    <div class="right">
      <div class="trend-container">
        <h3><span class="material-icons">trending_up</span>Item Trend</h3>

        <div class="item-container">

          <div class="most-borrowed">
            <h3>Most Borrowed Items</h3>

            <PieChart :data="mostBorrowedItems" label="Most Borrowed Items" />


          </div>


          <div class="most-damaged">
            <h3>Most Damaged Items</h3>

            <PieChart :data="mostDamagedItems" label="Most Damaged Items" />


          </div>
        </div>
      </div>
      
      <div class="chart1" >
        <h3><span class="material-icons">format_list_numbered</span>JHS and SHS Item Overview</h3>

        <div class="chartTB" v-if="hasChartData">
          
          <BarChart 
            :juniorHighData="juniorHighData"
            :seniorHighData="seniorHighData"
          />
          </div>
        </div>
    </div>
  </div>
  </main>
</template>

<script>
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
import api from '../service/axiosApi';

export default {
  components: {
    BarChart,
    PieChart,

  },
  data() {
    return {
      dashboardInfo: [],
      juniorHighData: [], 
      seniorHighData: [], 
      mostBorrowedItems: [], 
      mostDamagedItems: [], 
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
        this.dashboardInfo = response.data; 
        this.juniorHighData = Object.values(response.data.juniorHighInventory);
        this.seniorHighData = Object.values(response.data.seniorHighInventory);
        this.mostBorrowedItems = response.data.mostBorrowedItems; // Set most borrowed items
        this.mostDamagedItems = response.data.mostDamagedItems;   // Set most damaged items
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
  flex-direction: column;

  .left{
    flex: 0.5;
    margin-bottom: 1.5rem;
      
      .total-container{
        // margin-right: 1rem;
        flex: 0.5;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
        padding: 1.5rem;
        border-left: 6px solid var(--dark);
        border-right: 6px solid var(--dark);
        color: var(--dark);

        h3 {
          text-shadow: 0 0 1px;
          font-size: 20px;
          position:relative;
          bottom: 15px;
          
          .material-icons{
            position:relative;
            font-size: 35px;
            top: 12px;
            right: 2px;
          }
        }
      .total-equipment{
        display: flex;
        flex-direction: column;

        .top{
          text-align: center;
          padding: 1rem;
          flex: 0.5;

          h2{
            
            color: var(--dark-alt);
            font-weight: 900;
            text-shadow: 0 0 1px;
  
          }
          h1{
            font-size: 46px;
            color: var(--grey);
            font-weight: 900;
          }
        }
  
        .bottom{
          flex: 0.5;
          padding: 1rem;
          h5{
            color: var(--dark-alt);
            font-weight: 700;
          }
  
          h4{
            font-weight: 900;
            color: var(--grey);
          }
          
          .per-item{
            display: flex;
            padding: 0.5rem;
            text-align: center;
            border-radius: 5px;
            gap: 1.5rem;
            padding: 1rem;
        
          .borrowed{
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
            border-radius: 10px;
            border-top: 8px solid green;
  
          }
  
          .overdue{
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.100);
            border-radius: 10px;
            border-top: 8px solid orange;
  
          }
  
          .damaged{
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
            border-radius: 10px;
            border-top: 8px solid red;
  
          }
        }
      }
        .v-card {
          border-radius: 10px;
          padding: 0.5rem;
          
          .v-list-item-title {
            text-shadow: 0 0 1px;
            font-size: 20px;
            position:relative;
            color: var(--dark);
            padding: 0.5rem;
            
            .material-icons {
              position:relative;
              font-size: 35px;
              top: 12px;
              right: 2px;
            }
          }
        }
     
      }
    }
} 
  



.right{
  flex: 3;
  border-radius: 5px;
  display: flex;
  

  // h3 {
  //     text-shadow: 0 0 1px;
  //     font-size: 20px;
  //     position:relative;
  //     bottom: 15px;
      
  //     .material-icons{
  //       position:relative;
  //       font-size: 35px;
  //       top: 12px;
  //       right: 2px;
  //     }
  //   }
  


  .trend-container{
      // flex: 0.5;
      flex-direction: column;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
      padding: 2rem;
      border-left: 6px solid var(--dark);
      color: var(--dark);
      margin-right: 1rem;
      width: 100%;

      h3 {
        text-shadow: 0 0 1px;
        font-size: 20px;
        position:relative;
        bottom: 15px;

        .material-icons{
          position:relative;
          font-size: 35px;
          top: 12px;
          right: 2px;
        }
      }

      .item-container{
        display: flex;
        
        .most-borrowed{
          padding:2rem;
          border-radius: 10px;
          flex: 0.5;

          h3{
            text-align: center;
            font-size: 25px;
            color: var(--dark);
            font-weight: 900;
          }
  
        }
  
        .most-damaged{
          padding: 2rem;
          border-radius: 10px;
          flex: 0.5;

          h3{
            text-align: center;
            font-size: 25px;
            color: var(--dark-alt);
            font-weight: 600;
          }
        }
      }

    }

  .chart1 {
    width: 60%;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.200);
    padding: 2rem;
    border-right: 6px solid var(--dark);
    color: var(--dark);
    height: 80%;

      h3 {
        text-shadow: 0 0 1px;
        font-size: 20px;
        position:relative;
        bottom: 15px;

        .material-icons{
          position:relative;
          font-size: 35px;
          top: 12px;
          right: 2px;
      }
    }

    .chartTB {
      width: 100%;
      height: 30rem;
    }
  }
}
}



</style>
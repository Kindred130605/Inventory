<template>
<div class="container">

  <div class="total-container">
    <div class="total-equipment">
    <v-card elevation="2" outlined max-height="300rem">
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title >
                    <span class="material-icons">school</span>
                    School Equipment
                </v-list-item-title>

                <div class="top">
                    <v-card-text  v-if="dashboardInfo.totals" >
                       <h2>Total Equipment Count:</h2>  <br> <h1> {{ dashboardInfo.totals.item_quantity}}</h1>
                    </v-card-text> 
                </div>
               

                <div class="bottom">
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
            

        </v-list-item-content>
        </v-list-item>
        </v-card> 
      </div>
    </div>




  </div>



</template>

<script>
import api from '../service/axiosApi';

export default {
data() {
return {
  dashboardInfo: [],
};
},

mounted() {
this.getDashboard(); 
},

methods: {
async getDashboard() {
  try {
    const response = await api.get('/dashboard');
    this.dashboardInfo = response.data; 
    console.log(this.dashboardInfo);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
},
},
};
</script>

<style lang="scss" scoped>

.container {
  display: flex;

  .total-container {
    border-radius: 10px;
    flex: 1;
    margin-right: 1.5rem;

    .total-equipment{
      border-left: 6px solid var(--dark);
      border-radius: 15px;

      .top{
        text-align: center;
        padding: 1rem;
        h2{
          color: var(--dark-alt);
          font-weight: 900;
        }
        h1{
          font-size: 46px;
          color: var(--grey);
          font-weight: 900;
        }
      }

      .bottom{
        display: flex;
        padding: 0.5rem;
        text-align: center;
        border-radius: 5px;
        gap: 1.5rem;

        h5{
          color: var(--dark-alt);
          font-weight: 700;
        }

        h4{
          font-weight: 900;
          color: var(--grey);
        }

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
  }
  
}


.v-card {
  border-radius: 10px;
  padding: 0.5rem;

  .v-list-item-content {
    padding: 1px;
  }

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


</style>

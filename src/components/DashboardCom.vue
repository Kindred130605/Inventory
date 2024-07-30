<template>
    <main>
<div class="container">

  <div class="total-container">
    <div class="total-equipment">
    <v-card elevation="2" outlined max-height="300rem">
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title >
                    <span class="material-icons">school</span>
                    Total School Equipment 
                </v-list-item-title>
                <v-card-text  v-if="dashboardInfo.totals" class="text-h5 font-weight-bold">
                    All Equipment: {{ dashboardInfo.totals.item_quantity}}
                </v-card-text> 
                
                <v-card-text  v-if="dashboardInfo.totals" class="text-h5 font-weight-bold">
                    All Borrowed Items: {{ dashboardInfo.totals.borrowed_items}}
                </v-card-text> 
                
                <v-card-text  v-if="dashboardInfo.totals" class="text-h5 font-weight-bold">
                    All Overdue Items: {{ dashboardInfo.totals.overdue_items}}
                </v-card-text> 
                
                <v-card-text  v-if="dashboardInfo.totals" class="text-h5 font-weight-bold">
                    All Damage Items: {{ dashboardInfo.totals.damaged_items}}
                </v-card-text> 
            
        </v-list-item-content>
        </v-list-item>
        </v-card> 
      </div>
    </div>

    <div class="jhs-shs">
      <div class="jhs">
        <v-card elevation="2" outlined>
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title >
                        <span class="material-icons">school</span>
                       Junior High Equipment Inventory
                    </v-list-item-title>
    
                    <v-card-text v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                        All Equipment: {{ dashboardInfo.juniorHighInventory.item_quantity}}
                    </v-card-text>
    
                    <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 text--primary font-weight-bold">
                        All Borrowed Items: {{ dashboardInfo.juniorHighInventory.borrowed_items}}
                    </v-card-text>
                       
                    <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                        All Damaged Items: {{ dashboardInfo.juniorHighInventory.damaged_items}}
                    </v-card-text>
    
                    <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                        All Ovedue Items: {{ dashboardInfo.juniorHighInventory.overdue_items}}
                    </v-card-text>
                
            </v-list-item-content>
            </v-list-item>
    </v-card> 
            </div>
    
        <div class="shs">
        <v-card elevation="2" outlined>
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title >
                        <span class="material-icons">school</span>
                        Senior High Equipment Inventory 
                    </v-list-item-title>
                        
                    <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                            All Equipment: {{ dashboardInfo.seniorHighInventory.item_quantity}}
                        </v-card-text> 
                        
                        <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                            All Borrowed Items: {{ dashboardInfo.seniorHighInventory.borrowed_items}}
                        </v-card-text> 
                            
                        <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                            All Damaged Items: {{ dashboardInfo.seniorHighInventory.damaged_items}}
                        </v-card-text> 
                            
                        <v-card-text  v-if="dashboardInfo.juniorHighInventory" class="text-h5 font-weight-bold">
                            All Ovedue Items: {{ dashboardInfo.seniorHighInventory.overdue_items}}
                        </v-card-text> 
                
            </v-list-item-content>
            </v-list-item>
    </v-card> 
            </div>

    </div>



  </div>

</main>

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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}



.container {
  display: flex;
  min-width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  .total-container {
    margin-right: 1rem;
    border-radius: 10px;
    flex: 0.5;
    margin-bottom: 1rem;

    .total-equipment{
      border-left: 5px solid var(--dark);
      border-radius: 10px;

    }
  }
  

  .jhs-shs {
    border-radius: 5px;
    flex: 0.5;
    display: flex;
    .jhs{
      border-radius: 10px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      border-left: 5px solid var(--dark);
      margin-right: 1rem;
      flex: 0.5;
    }

    .shs{
      border-radius: 10px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      border-right: 5px solid var(--dark);
      flex: 0.5;

    }

  }


}


.v-card {
  min-width: 24vw;
  height: 30vh;
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

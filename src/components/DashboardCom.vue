<template>
    <main>
<div class="container">

    <div class="child-container">
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

    <div class="child-container">
    <v-card elevation="2" outlined>
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title >
                    <!-- <span class="material-icons">school</span> -->
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

    <div class="child-container">
    <v-card elevation="2" outlined max-hieght="300rem">
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title >
                    <!-- <span class="material-icons">school</span> -->
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

main {
  flex-direction: column;
}

.container {
  display: flex;
  min-width: 100%;
  flex-wrap: wrap;
}

.child-container {
  margin: 0 10px;
  border-style: solid;
  border-color: #374974;
  border-radius: 10px;
}

.v-card {
  min-width: 24vw;
  height: 30vh;
  border-radius: 10px;
  text-align: center;
 

  .v-list-item-content {
    padding: 1px;
  }

  .v-list-item-title {
    font-size: 1.6em;
    font-weight: bold;
    margin-bottom: 10px;

    .material-icons {
      font-size: 24px;
      margin-right: 10px;
    }
  }
}


</style>

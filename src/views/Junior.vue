<template>
    <main>
      <div class="main-content">
        <h2 class="header-title fw-bolder">
          <span class="material-icons">group</span>Junior Students Table
        </h2>
        <hr>
        <div class="table-section">
          <h3>Student Information</h3>
          <JuniorTable />
        </div>

      <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>View Students</v-card-title>
      <v-card-text>
        <v-text-field v-model="roomsData.rooms_num" label="Room Name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="saveRoom()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
        
            </div>
    </main>
  </template>
  
  <script>
  import JuniorTable from '../components/JuniorTable.vue';
 
  
  export default {
    components: {
      JuniorTable,
  
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    color: var(--dark);
  
    .header-title {
      display: flex;
      gap: 0.5rem;
  
      .material-icons {
        font-size: 2rem;
        position: relative;
        top: 3px;
      }
    }
  
    .table-section {
      margin-bottom: 2rem;
      background-color: #f0f0f0;
      padding: 1rem;
      border-radius: 10px;
    }
  
    .tables-container {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
  
      .table-section {
        flex: 1 1 calc(50% - 1rem);
        max-width: 50%;
      }
    }
  
    @media (max-width: 768px) {
      .tables-container {
        flex-direction: column;
      }
  
      .table-section {
        flex: 1 1 100%;
        max-width: 100%;
      }
    }
  }

  .title{
    display: flex;
    flex-direction: row;
  }
  </style>
  
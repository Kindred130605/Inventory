 <template>
          <v-row dense>
        <v-col
          v-for="card in rooms"
          :key="card.title"
          :cols=4
        >
          <v-card class="mx-auto"max-width="500">
            <v-img
              src="src/assets/SNA Logo with BG.png"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
            </v-img>

            <v-card-actions>
                 <v-card-title v-text="card.rooms_num"></v-card-title>
              <v-spacer></v-spacer>
            
              <v-btn color="primary" variant="flat" dark >VIEW</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
</template>

<script>
import api from '../service/axiosApi';

  export default {
    data (){
          return {
              search: '',
              rooms: [],
             
          };
    },

mounted() {
    this.getRooms();
    },
    methods: {
     async getRooms() {
      try {
        const response = await api.get('/rooms');
        this.rooms = response.data;
        console.log(this.rooms);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
        },


        
    },

      computed: {
        filteredItems() {
          return this.rooms.filter(item => {
            return rooms.rooms_num.toLowerCase().includes(this.search.toLowerCase()) 
          });
        }
}

  }

</script>

<style>

</style>
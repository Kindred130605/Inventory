<template>

  <v-data-table
    :search="search"
    :headers="headers"
    :items="displayedStudents"
    :sort-by="[{ key: 'studentId', order: 'asc' }]"
    
    
  >
    <template v-slot:top >
      <v-toolbar flat >
        <v-toolbar-title class="text-h6 font-weight-black " style="color: #2F3F64"></v-toolbar-title>
        <!-- <v-divider class="mx-2" inset vertical></v-divider> -->

        <v-text-field
        v-model="search"
        class="w-auto mr-4 "
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
      
      </v-toolbar>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.Items }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.room_number }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.Course_name }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteItem(item)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn class="text-h2" color="primary" @click="initialize">Reset</v-btn>
    </template> -->
  </v-data-table>
</template>

  <script>
export default {
  
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Items', align: 'start', key: 'Items'} ,
      { title: 'Status', key: 'status' },
      { title: 'Room', key: 'room_number' },
      { title: 'Quantity', key: 'quantity' },
      { title: 'Course', sortable: 'Course_name' },
      { title: 'Actions', sortable: false },
    ],
    Items: [],
    editedIndex: -1,
    editedItem: {
      Items:'',
      status: '',
      room_number: '',
      quantity: '',
      Course_name: '',
    },
    defaultItem: {
      Items:'',
      status: '',
      room_number: '',
      quantity: '',
      Course_name: '',
    },
    
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add Room' : 'Edit Room';
    },
    displayedStudents() {
      const searchTerm = this.search.toLowerCase(); // Convert search input to lowercase for case-insensitive comparison
    return this.students.filter(student =>
      Object.values(student).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm)
    )
    );
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.students = [
        { 
      Items: 'Chair',
      status: 'Available',
      room_number: '101',
      quantity: '500',
      Course_name: 'CCS',
    },
    { 
      Items: 'Tables',
      status: 'Available',
      room_number: '101',
      quantity: '250',
      Course_name: 'CCS',
    },
    { 
      Items: 'TV',
      status: 'Available',
      room_number: '101',
      quantity: '10',
      Course_name: 'CCS',
    },
    // add more items here

    { 
      Items: 'Whiteboard',
      status: 'Available',
      room_number: '101',
      quantity: '10',
      Course_name: 'CCS',
    },

      ];
      this.students.forEach(student => {
  student.full_name = `${student.first_name} ${student.middle_name} ${student.last_name} ${student.extension}`.trim();
    if (student.grade_level < 11 || student.grade_level > 12) {
        // Remove the strand property
        student.strand = "N/A";
    }
      });
    },

    editItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.students.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.students[this.editedIndex], this.editedItem);
      } else {
        this.students.push(this.editedItem);
      }
      this.close();
    },
    
  },
};
</script>

<style lang="scss">
.v-data-table {
  height: 100%;
}

   .table {
      max-height: 700vh;
    }

    .v-data-table {
      height: 100%;
    }
  </style>
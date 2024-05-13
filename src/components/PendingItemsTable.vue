<template>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="displayedStudents"
      :sort-by="[{ key: 'studentId', order: 'asc' }]"
      
      
    >
      <template v-slot:top >
        <v-toolbar flat >
          <v-toolbar-title class="text-h6 font-weight-black " style="color: #2F3F64">Ro Items</v-toolbar-title>
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
        
          <v-dialog v-model="dialog" max-width="1000px">
            
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2 rounded-l	" color="primary" dark v-bind="props" prepend-icon="mdi-plus">Add Room</v-btn>
            </template>
            
            <v-card >
              <v-card-title ><span class="text-h6 m-2" style="color: #2F3F64"  >{{ formTitle }}</span></v-card-title>
              <v-card-text > 
                <v-container >
                  <v-row dense >
                    <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.student_lrn"
                      label="LRN*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email Address*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                  cols="12"
                  md="4"
                  sm="6"
                  ></v-col>
  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.first_name"
                      label="First Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.middle_name"
                      hint="example of helper text only on focus"
                      label="Middle Name"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.last_name"
                      label="Last Name*"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="1"
                    sm="4"
                  >
                    <v-text-field
                      v-model="editedItem.extension"
                      label="Extension Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-select
                      v-model="editedItem.sex_at_birth"
                      :items="['Male', 'Female', 'Other']"
                      label="Sex*"
                      required
                    ></v-select>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.birth_date"
                      label="Birthdate*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.birth_place"
                      label="Birthplace*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-select
                      v-model="editedItem.civil_status"
                      :items="['Single','Married','Divorced']"
                      label="Civil Status*"
                      required
                    ></v-select>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.citizenship"
                      label="Citizenship*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="2"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.religion"
                      label="Religion*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.street"
                      label="Street*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.barangay"
                      label="Barangay*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.city"
                      label="City*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.province"
                      label="Provice*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.region"
                      label="Region*"
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="3"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.zip_code"
                      label="Zip Code*"
                      required
                    ></v-text-field>
                  </v-col>
                  
            </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.extension }}</td>
          <td>{{ item.student_id }}</td>
          <td>{{ item.student_lrn }}</td>
          <td>{{ item.grade_level }}</td>
          <td>{{ item.strand }}</td>
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
        { title: 'Items', align: 'start', key:'Item_name'},
        { title: 'Description', key: 'description' },
        { title: 'Room', key: 'room_number' },
        { title: 'Quantity', key: 'no._quantity' },
        { title: 'Actions', sortable: false },
      ],
      Items: [],
      editedIndex: -1,
      editedItem: {
        student_id: '',
        student_lrn: '',
        grade_level: '',
        strand: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        sex_at_birth: '',
        birth_date: '',
        birth_place: '',
        civil_status: '',
        citizenship: '',
        religion: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        region: '',
        zip_code: '',
      },
      defaultItem: {
        student_id: '',
        student_lrn: '',
        grade_level: '',
        strand: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        sex_at_birth: '',
        birth_date: '',
        birth_place: '',
        civil_status: '',
        citizenship: '',
        religion: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        region: '',
        zip_code: '',
        
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
        student_id: '2021001', 
        student_lrn: '1234567890', 
        grade_level: '10', 
        strand: 'STEM', 
        email: 'john.doe@example.com',
        first_name: 'John',
        middle_name: '',
        last_name: 'Doe',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '1999-05-15',
        birth_place: 'New York',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Main Street',
        barangay: 'San Juan',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1234'
      },
      { 
        student_id: '2021002', 
        student_lrn: '0987654321', 
        grade_level: '11', 
        strand: 'ABM', 
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        middle_name: 'Elizabeth',
        last_name: 'Smith',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-03-25',
        birth_place: 'Los Angeles',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Oak Avenue',
        barangay: 'San Antonio',
        city: 'Los Angeles',
        province: 'California',
        region: 'California',
        zip_code: '90001'
      },
      { 
        student_id: '2021003',
        student_lrn: '1234567890',
        grade_level: '10',
        strand: 'STEM',
        email: 'john.johnson@example.com',
        first_name: 'John',
        middle_name: 'William',
        last_name: 'Johnson',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2001-02-15',
        birth_place: 'Chicago',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Maple Street',
        barangay: 'San Andres',
        city: 'Chicago',
        province: 'Illinois',
        region: 'Illinois',
        zip_code: '60601'
      },
      // Add more students here...
      { 
        student_id: '2021004',
        student_lrn: '0987654321',
        grade_level: '11',
        strand: 'ABM',
        email: 'mary.brown@example.com',
        first_name: 'Mary',
        middle_name: 'Ann',
        last_name: 'Brown',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-07-10',
        birth_place: 'Houston',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Pine Street',
        barangay: 'San Roque',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1235'
      },
      { 
        student_id: '2021005',
        student_lrn: '1234567890',
        grade_level: '12',
        strand: 'HUMSS',
        email: 'michael.miller@example.com',
        first_name: 'Michael',
        middle_name: 'Robert',
        last_name: 'Miller',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '1999-11-20',
        birth_place: 'Philadelphia',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Cedar Street',
        barangay: 'Sta. Mesa',
        city: 'Manila',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1236'
      },
      { 
        student_id: '2021006',
        student_lrn: '0987654321',
        grade_level: '10',
        strand: 'STEM',
        email: 'emily.taylor@example.com',
        first_name: 'Emily',
        middle_name: 'Grace',
        last_name: 'Taylor',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2001-05-30',
        birth_place: 'Phoenix',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Elm Street',
        barangay: 'Sta. Ana',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1237'
      },
      { 
        student_id: '2021007',
        student_lrn: '1234567890',
        grade_level: '11',
        strand: 'ABM',
        email: 'william.white@example.com',
        first_name: 'William',
        middle_name: 'David',
        last_name: 'White',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2000-09-05',
        birth_place: 'San Diego',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Birch Street',
        barangay: 'Poblacion',
        city: 'Mandaluyong',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1238'
      },
      { 
        student_id: '2021008',
        student_lrn: '0987654321',
        grade_level: '12',
        strand: 'HUMSS',
        email: 'sophia.thompson@example.com',
        first_name: 'Sophia',
        middle_name: 'Nicole',
        last_name: 'Thompson',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '1999-12-10',
        birth_place: 'San Francisco',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Willow Street',
        barangay: 'Ayala Alabang',
        city: 'Muntinlupa',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1239'
      },
      { 
        student_id: '2021009',
        student_lrn: '1234567890',
        grade_level: '10',
        strand: 'STEM',
        email: 'ethan.thomas@example.com',
        first_name: 'Ethan',
        middle_name: 'Joseph',
        last_name: 'Thomas',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2001-06-20',
        birth_place: 'Dallas',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Chestnut Street',
        barangay: 'Poblacion',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1240'
      },
      { 
        student_id: '2021010',
        student_lrn: '0987654321',
        grade_level: '11',
        strand: 'ABM',
        email: 'olivia.anderson@example.com',
        first_name: 'Olivia',
        middle_name: 'Rose',
        last_name: 'Anderson',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-08-15',
        birth_place: 'Seattle',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Juniper Street',
        barangay: 'San Lorenzo',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1241'
      },
      { 
        student_id: '2021012', 
        student_lrn: '1234567890', 
        grade_level: '11', 
        strand: 'STEM', 
        email: 'emma.johnson@example.com',
        first_name: 'Emma',
        middle_name: 'Grace',
        last_name: 'Johnson',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-04-18',
        birth_place: 'Chicago',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Elm Street',
        barangay: 'San Andres',
        city: 'Chicago',
        province: 'Illinois',
        region: 'Illinois',
        zip_code: '60601'
      },
      { 
        student_id: '2021013',
        student_lrn: '0987654321',
        grade_level: '10',
        strand: 'ABM',
        email: 'daniel.wilson@example.com',
        first_name: 'Daniel',
        middle_name: 'James',
        last_name: 'Wilson',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2001-01-12',
        birth_place: 'Houston',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Pine Street',
        barangay: 'San Roque',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1235'
      },
      { 
        student_id: '2021014',
        student_lrn: '1234567890',
        grade_level: '12',
        strand: 'HUMSS',
        email: 'oliver.anderson@example.com',
        first_name: 'Oliver',
        middle_name: 'Michael',
        last_name: 'Anderson',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '1999-07-30',
        birth_place: 'Philadelphia',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Cedar Street',
        barangay: 'Sta. Mesa',
        city: 'Manila',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1236'
      },
      { 
        student_id: '2021015',
        student_lrn: '0987654321',
        grade_level: '11',
        strand: 'ABM',
        email: 'sophia.clark@example.com',
        first_name: 'Sophia',
        middle_name: 'Rose',
        last_name: 'Clark',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-02-05',
        birth_place: 'Phoenix',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Oak Street',
        barangay: 'Sta. Ana',
        city: 'Taguig',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1237'
      },
      { 
        student_id: '2021016',
        student_lrn: '1234567890',
        grade_level: '10',
        strand: 'STEM',
        email: 'mia.white@example.com',
        first_name: 'Mia',
        middle_name: 'Elizabeth',
        last_name: 'White',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2001-08-20',
        birth_place: 'San Diego',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Birch Street',
        barangay: 'Poblacion',
        city: 'Mandaluyong',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1238'
      },
      { 
        student_id: '2021017',
        student_lrn: '0987654321',
        grade_level: '12',
        strand: 'HUMSS',
        email: 'ethan.hall@example.com',
        first_name: 'Ethan',
        middle_name: 'Andrew',
        last_name: 'Hall',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '1999-06-15',
        birth_place: 'San Francisco',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Willow Street',
        barangay: 'Ayala Alabang',
        city: 'Muntinlupa',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1239'
      },
      { 
        student_id: '2021018',
        student_lrn: '1234567890',
        grade_level: '10',
        strand: 'STEM',
        email: 'amelia.martin@example.com',
        first_name: 'Amelia',
        middle_name: 'Charlotte',
        last_name: 'Martin',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2001-10-10',
        birth_place: 'Dallas',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Chestnut Street',
        barangay: 'Poblacion',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1240'
      },
      { 
        student_id: '2021019',
        student_lrn: '0987654321',
        grade_level: '11',
        strand: 'ABM',
        email: 'william.young@example.com',
        first_name: 'William',
        middle_name: 'Matthew',
        last_name: 'Young',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2000-12-05',
        birth_place: 'Seattle',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Juniper Street',
        barangay: 'San Lorenzo',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1241'
      },
      { 
        student_id: '2021020',
        student_lrn: '1234567890',
        grade_level: '12',
        strand: 'HUMSS',
        email: 'emily.harris@example.com',
        first_name: 'Emily',
        middle_name: 'Olivia',
        last_name: 'Harris',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '1999-11-25',
        birth_place: 'Boston',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Magnolia Street',
        barangay: 'San Isidro',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'National Capital Region (NCR)',
        zip_code: '1242'
      },
      { 
        student_id: '2021021',
        student_lrn: '0987654321',
        grade_level: '10',
        strand: 'STEM',
        email: 'alexander.king@example.com',
        first_name: 'Alexander',
        middle_name: 'David',
        last_name: 'King',
        extension: '',
        sex_at_birth: 'Male',
        birth_date: '2001-03-18',
        birth_place: 'San Jose',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Sycamore Street',
        barangay: 'San Antonio',
        city: 'Los Angeles',
        province: 'California',
        region: 'California',
        zip_code: '90001'
      },
      { 
        student_id: '2021022',
        student_lrn: '1234567890',
        grade_level: '11',
        strand: 'ABM',
        email: 'mia.lewis@example.com',
        first_name: 'Mia',
        middle_name: 'Sophia',
        last_name: 'Lewis',
        extension: '',
        sex_at_birth: 'Female',
        birth_date: '2000-09-12',
        birth_place: 'San Antonio',
        civil_status: 'Single',
        citizenship: 'American',
        religion: 'Christianity',
        street: 'Maple Street',
        barangay: 'San Andres',
        city: 'Chicago',
        province: 'Illinois',
        region: 'Illinois',
        zip_code: '60601'
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
  
  </style>
  
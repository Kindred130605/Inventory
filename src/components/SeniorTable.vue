<template>
    
    <v-data-table
      :headers="headers"
      :items="students"
      class="student-info-table"
    >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          class="w-auto mr-4"
          density="compact"
          label="Search Record"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          style="max-width: 500px;"
        ></v-text-field>
      </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.student_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.grade_level }}</td>
          <td>{{ item.strand }}</td>
          <td>
            <v-icon class="me-2" size="small" style="color: #2F3F64" @click="viewStudent(item)">mdi-eye</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="viewingStudent" max-width="1000px">
      <v-card>
        <v-card-title>Student Recent Activities</v-card-title>
        <v-card-text>
          <div v-if="selectedStudent">
            <p><strong>Student ID:</strong> {{ selectedStudent.student_id }}</p>
            <p><strong>Name:</strong> {{ selectedStudent.name }}</p>
            <hr>
            <h4>Department</h4>
          <p><strong>Grade Level:</strong> {{ recentExam.grade_level }}</p>
          <p><strong>Course:</strong> {{ recentExam.department }}</p>
          <p><strong>Year:</strong> {{ recentExam.course }}</p>
          <hr>
          <h4>Contact Info</h4>
          <p><strong>Email:</strong> {{ pendingViolation.email }}</p>
          <p><strong>Cellphone Number:</strong> {{ pendingViolation.cellphone_number }}</p>
          <p><strong>Emergency Number:</strong> {{ pendingViolation.emergency_number }}</p>
          <p><strong>Address:</strong> {{ pendingViolation.address }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" @click="viewingStudent = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
export default {
  data() {
    return {
      students: [
        {
          student_id: 'S1234',
          name: 'Jonathan Doe',
          grade_level: '11',
          strand: 'STEM'
        }
      ],
      headers: [
        { title: 'Student ID', key: 'student_id' },
        { title: 'Name', key: 'name' },
        { title: 'Grade Level', key: 'profile_status' },
        { title: 'Strand', key: 'strand' }
      ],
      viewingStudent: false,
      selectedStudent: null,
      recentExam: {
      grade_level: '11',
      Department: 'CCS',
      course: 'BSIT'
    },
    pendingViolation: {
      email: 'email@person.com',
      cellphone_number: '09xxxxxxx',
      emergency_number: '09xxxxxxx',
      address: 'Donor St. East Tapinac, O.C'
    }
    };
  },
  methods: {
    viewStudent(student) {
      this.selectedStudent = student;
      this.viewingStudent = true;
    }
  }
};
</script>

<style scoped>
.student-info-table {
  max-height: 150vh;
}
</style>

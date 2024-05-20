<template>
    
      <v-data-table
        :headers="headers"
        :items="students"
        class="student-info-table"
      >
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
        
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.student_id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.profile_status }}</td>
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
              <h4>Recent Examination</h4>
              <p><strong>Exam Title:</strong> {{ recentExam.exam_title }}</p>
              <p><strong>Exam Score:</strong> {{ recentExam.exam_score }}</p>
              <p><strong>Exam Date:</strong> {{ recentExam.exam_date }}</p>
              <hr>
              <h4>Pending Violation</h4>
              <p><strong>Violation ID:</strong> {{ pendingViolation.violation_id }}</p>
              <p><strong>Description:</strong> {{ pendingViolation.description }}</p>
              <p><strong>Status:</strong> {{ pendingViolation.status }}</p>
              <p><strong>Date:</strong> {{ pendingViolation.date }}</p>
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
            name: 'John Doe',
            profile_status: 'Active'
          }
        ],
        headers: [
          { title: 'Student ID', key: 'student_id' },
          { title: 'Name', key: 'name' },
          { title: 'Profile Status', key: 'profile_status' },
          { title: 'Actions', sortable: false }
        ],
        viewingStudent: false,
        selectedStudent: null,
        recentExam: {
          exam_title: 'Math Test',
          exam_score: 95,
          exam_date: '2024-05-18'
        },
        pendingViolation: {
          violation_id: 'V5678',
          description: 'Late submission of assignment',
          status: 'Pending',
          date: '2024-05-18'
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
  
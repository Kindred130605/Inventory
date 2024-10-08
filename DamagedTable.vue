<template>
  <v-data-table 
  :search="search" 
  :headers="headers" 
  :items="damagelist" 
  :sort-by="[{ key: 'items_name', order: 'asc' }]">
    <!-- toolbar  -->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="text-h6 font-weight-black" style="color: #2F3F64"></v-toolbar-title>
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
      <v-btn color="primary" variant="flat" dark @click="downloadXLS()" class="tooltip-button"
    data-bs-toggle="tooltip" 
    data-bs-placement="bottom" 
    data-bs-title="DOWNLOAD EXCELL">
          <v-icon left>mdi-download</v-icon>
          GENERATE REPORT
        </v-btn>
      </v-toolbar>
    </template>


    <template v-slot:item= '{ item }'>
      <tr :key="item.item_id">
        <td>{{ item.item_name }}</td>
        <td>{{ item.category}}</td>
        <td>{{ item.unit_of_measure}}</td>
        <td>{{ item.room_number}}</td>
        <td>{{ item.school_level}}</td>
        <td>{{ item.report_by	}}</td>
        <td>{{ item.description}}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.date_reported}}</td>
        <td>{{ item.adviser}}</td>

        <td>
          <div class="icon-container">

          <v-btn @click="returnItem(item)" style="color:green" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Return Item"><v-icon>mdi-clipboard-arrow-left</v-icon></v-btn>
          <v-btn @click="unusableItem(item)" style="color:red" class="tooltip-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Unusable Item"><v-icon>mdi-alert-decagram</v-icon></v-btn>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>

    <!-- Add a dialog for filtering -->
    <v-dialog v-model="filterDialog" max-width="500">
    <v-card>
      <v-card-title>Filter Report</v-card-title>
      <v-card-text>
        <v-form ref="filterForm">
          <v-select v-model="filter.category" :items="chmeasure" label="Category"></v-select>
          <v-select v-model="filter.unitOfMeasure" :items="chquantity" label="Unit of Measure"></v-select>
          <v-select v-model="filter.roomNumber" :items="roomNumbers" label="Room Number"></v-select>
          <v-select v-model="filter.schoolLevel" :items="chschool" label="School Level"></v-select>
          <v-select v-model="filter.acceptedBy" :items="acceptedBy" label="Accepted By"></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="downloadXLS()">Generate Report</v-btn>
        <v-btn color="error" @click="filterDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import api from '../service/axiosApi.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ExcelJS from 'exceljs';
export default {
 
  data() {
    return {
      search: '',
      damagelist: [],
      headers: [
        { title: 'Item Name', key: 'item_name' },
        { title: 'Category', key: 'category' },
        { title: 'Unit Of Measure', key: 'unit_of_measure' },
        { title: 'Room Number', key: 'room_number' },
        { title: 'School Level', key: 'school_level' },
        { title: 'Reported By', key: 'report_by' },
        { title: 'Description', key: 'description' },
        { title: 'Item Quantity', key: 'quantity' },
        { title: 'Date Reported', key: 'date_reported' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Action' },
      ],     
      damagedItemData: {
      item_id: null,
      item_name: '',
      category: '',
      unit_of_measure: '',
      room_number: '',
      school_level: '',
      report_by: '',
      description: '',
      date_reported: '',
      adviser: '',
      quantity: 1,
    },

    studentsList: [],

      filter: {
        category: null,
        unitOfMeasure: null,
        roomNumber: null,
        schoolLevel: null,
        acceptedBy: null
      },
      filterDialog: false,

    };
},

mounted(){
this.getDamagedItems();
    //this.getStudents();
    this.$nextTick(() => {
      this.initializeTooltips();
    });
},

methods: {
  async getDamagedItems() {
    try {
      const response = await api.get('/damaged-items');
      this.damagelist = response.data;
      this.$nextTick(() => {
          this.initializeTooltips();
        });
      console.log(this.damagelist);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  },

  initializeTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    },

  async returnItem(item) {
  try {
    // Ensure the request payload matches the backend validation rules
    await api.post('/damaged-items/repair', {
      item_id: item.item_id, // Ensure this field is correct
      quantity: item.quantity, // Ensure this field is correct
    });

    // Update local state to remove the repaired item
    this.damagelist = this.damagelist.filter(d => d.item_id !== item.item_id);

    this.getDamagedItems();

    Swal.fire('Success', 'Item repaired successfully', 'success');
  } catch (error) {
    console.error('Error repairing item:', error);
    Swal.fire('Error', 'Failed to repair item', 'error');
  }
},

async unusableItem(item) {
  try {
    const result = await Swal.fire({
      title: 'Confirm',
      text: `Are you sure you want to mark ${item.item_name} as unusable?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as unusable',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      await api.post('/unusable-items', {
        item_id: item.item_id,
        item_name: item.item_name,
        category: item.category,
        unit_of_measure: item.unit_of_measure,
        room_number: item.room_number,
        school_level: item.school_level,
        report_by: item.report_by,
        description: item.description,
        date_reported: item.date_reported,
        adviser: item.adviser,
        quantity: item.quantity,
      });

      // Optionally remove or update the item from the list
      this.damagelist = this.damagelist.filter(d => d.item_id !== item.item_id);

      Swal.fire('Success', 'Item marked as unusable successfully', 'success');
    }
  } catch (error) {
    console.error('Error marking item as unusable:', error);
    Swal.fire('Error', 'Failed to mark item as unusable', 'error');
  }
},

  async convertExcel(data) {
  const excel = new ExcelJS.Workbook();
  const worksheet = excel.addWorksheet("Items");

  try {
    const imageResponse = await fetch('/src/assets/schoolLogo3.png');
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await this.blobToBase64(imageBlob); // Use `this` to access the method

    const logo = excel.addImage({
      base64: imageBase64,
      extension: 'png'
    });

    worksheet.addImage(logo, {
      tl: { col: 0, row: 0 },
      ext: { width: 180, height: 120 },
      editAs: 'absolute'
    });

    worksheet.addImage(logo, {
      tl: { col: 7, row: 0 },
      ext: { width: 180, height: 120 },
      editAs: 'absolute'
    });


    worksheet.mergeCells('A2:J2');
    worksheet.getCell('A2').value = 'Saint Nicholas Academy';
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A2').font = { size: 16, bold: true };

    worksheet.addRow(); 

    worksheet.mergeCells('A3:J3');
    worksheet.getCell('A3').value = 'Address';
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A3').font = { size: 12 };

    worksheet.mergeCells('A4:J4');
    worksheet.getCell('A4').value = 'Contact No';
    worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A4').font = { size: 12 };

    worksheet.addRow(); // Add an empty row for separation

    // Add column headers
    worksheet.addRow([
      'Item Name',
      'Category',
      'Unit Of Measure',
      'Room Number',
      'School Level',
      'Reported By',
      'Description',
      'Item Quantity',
      'Date Reported', 
      'Adviser'
    ]);

    // Add data rows
    data.forEach(item => {
      worksheet.addRow([
      item.item_name,
      item.category,
      item.unit_of_measure,
      item.room_number,
      item.school_level,
      item.report_by,
      item.description,
      item.quantity,
      item.date_reported,
      item.adviser,
      ]);
    });

    return excel; // Return the excel workbook
  } catch (error) {
    console.error('Error in convertExcel:', error);
  }
},

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Split to get base64 part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  async downloadXLS() {
    try {
      const data = this.damagelist; // Or any other data you want to export
      //const data = this.applyFilters(this.damagelist); // Or any other data you want to export
      const excel = await this.convertExcel(data); // Make sure convertExcel is awaited

      if (excel instanceof ExcelJS.Workbook) {
        const buffer = await excel.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Damage.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire('Success!', 'Generate report successfully', 'success');

      } else {
        Swal.fire({
          title: 'Cannot Download',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Invalid ExcelJS.Workbook instance');
      }
    } catch (error) {
      console.error('Error downloading XLS:', error);
    }
  },

  applyFilters(data) {
      let filteredData = data;
      if (this.filter.category) {
        filteredData = filteredData.filter(item => item.category === this.filter.category);
      }
      if (this.filter.unitOfMeasure) {
        filteredData = filteredData.filter(item => item.unit_of_measure === this.filter.unitOfMeasure);
      }
      if (this.filter.roomNumber) {
        filteredData = filteredData.filter(item => item.room_number === this.filter.roomNumber);
      }
      if (this.filter.schoolLevel) {
        filteredData = filteredData.filter(item => item.school_level === this.filter.schoolLevel);
      }
      if (this.filter.acceptedBy) {
        filteredData = filteredData.filter(item => item.acceptedby === this.filter.acceptedBy);
      }
      return filteredData;
    },

    showFilterDialog() {
      this.filterDialog = true;
    }
},
watch: {
  damagelist() {
    this.$nextTick(() => {
      this.initializeTooltips();
    });
  }
}

//computed: {
//  filteredItems() {
//    return this.damagelist.filter(item => {
//      return item.item_name.toLowerCase().includes(this.search.toLowerCase()) ||
//        item.item_quantity.toString().includes(this.search) || item.acceptedby.toLowerCase().includes(this.search.toLowerCase());
//    });
//}
//  roomNumbers() {
//    return [...new Set(this.damagelist.map(item => item.room_number))];
//}
//  acceptedBy() {
//    return [...new Set(this.damagelist.map(item => item.acceptedby))];
//  }
//},

};

</script>

<style lang="scss">
.v-table__wrapper{
  color: black;
  padding: 1.5rem;

  .v-data-table__th {
    font-size: 17px;
    font-weight: 800;

  }


}
.icon-container {
  gap: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .v-icon{
    font-size: 28px;
  }
}

</style>
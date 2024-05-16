<template>
    <main>
        <div class="top-container">
            <div class="studentProfile">
                <span class="material-icons">inventory</span>
                <span class="text">Borrowing</span>
            </div>

        </div>  
        <hr>

        <div class="main-content">

            <div class="student-table">
                <RecordsTable/>
            </div>
        </div>

        
</main>

</template>

<script>
// import AddStudent from '../components/AddStudent.vue';
import RecordsTable from '../components/RecordsTable.vue'; // dalawa dito

export default {
  components: {
    // AddStudent,
    RecordsTable
  }
};
</script>

<style lang="scss" scoped>
.top-container{
    display: flex;
    margin: 0.5rem;
    .studentProfile{
        flex: 1;
        
        .material-icons{
            color: var(--dark);
            font-size: 2.5rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 1.5rem;
            font-weight: 900;
            bottom: 0.5rem;
        }
    }

} 

.main-content {
    display: flex;
    flex-direction: column;

    .student-table{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>
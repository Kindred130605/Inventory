<template>
    <main>
        <div class="top-container">
            <div class="studentProfile">
                <span class="material-icons">pending_actions</span>
                <span class="text">Borrowing</span>
            </div>

        </div>  
        <hr>

        <div class="main-content">

            <div class="student-table">
                <BorrowingTables/>
            </div>
        </div>

        
</main>

</template>

<script>
// import AddStudent from '../components/AddStudent.vue';
import BorrowingTables from '../components/BorrowingTables.vue';

export default {
  components: {
    // AddStudent,
    BorrowingTables
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
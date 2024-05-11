<template>
    <main>
        <div class="top-container">
            <div class="room">
                <span class="material-icons">badge</span>
                <span class="text">Rooms</span>
            </div>

        </div>  
        <hr>

        <div class="main-content">

            <div class="room">
                <Room/>
            </div>
        </div>

        
</main>

</template>

<script>
// import AddStudent from '../components/AddStudent.vue';
import RoomTables from '../components/RoomTables.vue';
import Room from './Room.vue';

export default {
  components: {
    // AddStudent,
    RoomTables
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
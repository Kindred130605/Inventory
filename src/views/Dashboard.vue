<template>
    <main>
        <div class="left-container">
            <div class="top-left">
                <div class="total-student">
                <h1 class="info-text">
                    <span class="material-icons">feed</span>
                    Inventory Summary</h1>    
                <h3>Item Categories:</h3>
                <h1>0000</h1>

                <div class="student-count">
                    <div class="jhs">
                        <h4>Junior High School</h4>
                        <div class="jhs-total">
                            <h5>Item</h5>
                            <h3>0000</h3>
                        </div>
                        <div class="jhs-total">
                            <h5>Date</h5>
                            <h3>00/00/00</h3>
                        </div>
                        <div class="jhs-total">
                            <h5>Item Description</h5>
                            <h3>----</h3>
                        </div>
                        <div class="jhs-total">
                            <h5>Quantity</h5>
                            <h3>0000</h3>
                        </div>
                    </div>

                </div>
                </div>
            </div>
                
            <div class="bottom-left">
                <h3><span class="material-icons"> campaign</span>Announcement</h3>
                    

                </div>
        </div>
        
        <div class="right-container">
                TBA
        </div>
    </main>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
main {
    display: flex;
}
.left-container{
    flex: 0.5;
    margin-right: 1rem;
    .top-left{
        padding: 2rem;
        background-color: #f0f0f0;
        margin-bottom: 2rem;
        color: var(--dark);
        border-radius:5px;

        .total-student{
            display: flex;
            flex-direction: column;

            .info-text{
                text-shadow: 0 0 1px;
                font-size: 30px;
                margin-bottom: 1rem;

                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
            }
            h2{
                align-self: center;
                margin-bottom: 1rem;
                font-weight: 900;
            }

            h3{
                font-weight: 600;
            }
            h1{
                align-self: center;
                padding: 10px;
                font-size: 50px;
                text-shadow: 0px 1px, 1px 0px, 1px 1px;

             }

            .student-count{
                display: flex;

                h4{
                    font-weight: 600;
                }
            
            .jhs{
                flex: 0.8;
                padding: 0.5rem;

                .jhs-total{
                    display: flex;
                    margin: 1rem;

                    h5{
                        margin-right: 1.5rem;
                        width: 3.5rem;
                    }

                    h3{
                        text-shadow: 0 0 1px;
                    }
                }


            }

            .shs{
                padding: 0.5rem;

                .shs-total{
                    display: flex;
                    margin: 1rem;

                    h5{
                        margin-right: 1.5rem;
                        width: 3.5rem;
                    }
                    h3{
                        text-shadow: 0 0 1px;
                    }
                }
            }

            }
        }
    }
    .bottom-left{
        padding: 1.5rem;
        background-color: #f0f0f0;
        color: var(--dark);
            
        h3 {
            text-shadow: 0 0 1px;
            font-size: 20px;
        }
        .material-icons{
            position:relative;
            font-size: 35px;
            top: 10px;
        }
    }
}

.right-container{
    flex: 0.5;
    padding: 2rem;
    background-color: #c0c0c0;
}
</style>
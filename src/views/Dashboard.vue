<template >
    <main>
        <section>            
            <div class="top-container">
                <div class="studentProfile">
                    <span class="material-icons">dashboard</span>
                    <span class="text">Dashboard</span>   
                </div>    
            </div> 
            <hr>
        </section>

    <div class="left-container">
        <div class="top-left">
            <div class="total-student">
                <h2 class="info-text">
                    <span class="material-icons">school</span>
                    Total Classroom Equipment 
                    <br>    
                    <span class="card-1">{{ dashboardInfo.classroom }}</span> 
                </h2>  
            </div>
        </div>

        <div class="buttom-left">
            <div class="total-student">
                <h2 class="info-text">
                    Items:
                </h2>  
                <canvas ref="chart1Canvas"></canvas>
            </div>
        </div>
    </div>

    <div class="middle-container">
        <div class="top-left">
            <div class="total-student">
                <h2 class="info-text">
                    <span class="material-icons">school</span>
                    Total School Supplies 
                    <br>    
                    <span class="card-1">{{ dashboardInfo.school_supply }}</span> 
                </h2>  
            </div>
        </div>

        <div class="buttom-left">
            <div class="total-student">
                <h2 class="info-text">
                    Items:
                </h2>  
                <canvas ref="chart1Canvas"></canvas>
            </div>
        </div>
    </div>

    <div class="right-container">
            <div class="top-right">
                <div class="total-students">
            <h1 class="info-text">
                <span class="material-icons">school</span>
                Total School Equipment
                  <br>    
                <span class="card-2">{{ dashboardInfo.all_items }}</span> 
                <span class="card-2">-</span> 
            </h1>
            </div>
        </div>
            <div class="buttom-right">
            <h1 class="info-text">
                Items:
            </h1>
            <canvas ref="chart2Canvas"></canvas>
        </div>
     
    </div>

    <div class="announcement-button-container">
            <button class="announcement-button">Announcement</button>
        </div>

    </main>
</template>

<script>
import api from '../service/axiosApi';
export default {
  data() {
    return {
      dashboardInfo: [],
    };
  },

  mounted() {
    this.getDashboard(); 
  },

  methods: {
    async getDashboard() {
      try {
        const response = await api.get('/dashboardview');
        this.dashboardInfo = response.data; 
        console.log(this.dashboardInfo);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
main {
    display: flex;
}
.top-container{
    display: flex;
    margin: 0.5rem;
    .studentProfile{
        flex: 1;

        .material-icons{
            position: relative;
            color: var(--dark);
            font-size: 2.5rem;
            top: -0.01rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 3.0rem;
            font-weight: 900;
            bottom: 0.2rem;
            left: 0.5rem;   
        }
    }
}
.left-container{
    flex: 0.5;
    margin-right: 1rem;
    margin-top: 150px;
    border-radius: 10px;
    background-color: #f0f0f0;
    padding: 0.5rem;

    .top-left{
        padding: 1rem;
        background-color: #ffffff;
        margin-bottom: 2rem;
        color: black;
        width: 100%;
        height: 120px;
        border-style: solid;
        border-color: #2F3F64;
        text-align: center;

        .total-student{
            display: flex;
            flex-direction: column;
            
            .info-text{
                text-shadow: 0 0 1px;
                font-size: 25px;
                margin-bottom: 1rem;
                font-weight: bold;
        
                
                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
                .card-1{
                    font-size: 30px;
                }
            }
            h2{
                align-self: left;
                margin-bottom: 1rem;
                font-weight: 900;
                
            }

            h3{
                font-weight: 600;
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
    
    .buttom-left{
        height: 79%;
        width: 100%;
        padding: 1rem;
        background-color: #ffffff;
        margin-bottom: 2rem;
        color: black;
        border-style: solid;
        border-color: #2F3F64;
        border-width: 1px 1px 1px 1px;  
        @media (min-width: 768px) {
            width: calc(100% - 1px); 
            transition: width 0.1s; 
        }

        .total-student{
            display: flex;
            flex-direction: column;
            
            .info-text{
                text-shadow: 0 0 1px;
                font-size: 25px;
                margin-bottom: 1rem;
                font-weight: bold;

                
                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
            }
        }
    }
}
section{
    position: absolute;
    width: 100%;
}
.bg-title{
    z-index: -1;
    position: absolute;
    opacity: 10%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
}
.top-container{
    display: flex;
    margin: 0.5rem;
    .studentProfile{
        flex: 1;

        .material-icons{
            position: relative;
            color: var(--dark);
            font-size: 2.5rem;
            top: -0.01rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 1.5rem;
            font-weight: 900;
            bottom: 0.6rem;
            left: 0.5rem;   
        }
    }
} 

.middle-container{
    flex: 0.5;
    margin-right: 1rem;
    margin-top: 150px;
    border-radius: 10px;
    background-color: #f0f0f0;
    padding: 0.5rem;

    .top-left{
        padding: 1rem;
        background-color: #ffffff;
        margin-bottom: 2rem;
        color: black;
        width: 100%;
        height: 120px;
        border-style: solid;
        border-color: #2F3F64;
        text-align: center;

        .total-student{
            display: flex;
            flex-direction: column;
            
            .info-text{
                text-shadow: 0 0 1px;
                font-size: 25px;
                margin-bottom: 1rem;
                font-weight: bold;
        
                
                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
                .card-1{
                    font-size: 30px;
                    background-color: aqua;
                }
            }
            h2{
                align-self: left;
                margin-bottom: 1rem;
                font-weight: 900;
                
            }

            h3{
                font-weight: 600;
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
    
    .buttom-left{
        height: 79%;
        width: 100%;
        padding: 1rem;
        background-color: #ffffff;
        margin-bottom: 2rem;
        color: black;
        border-style: solid;
        border-color: #2F3F64;
        border-width: 1px 1px 1px 1px;  
        @media (min-width: 768px) {
            width: calc(100% - 1px); 
            transition: width 0.1s; 
        }

        .total-student{
            display: flex;
            flex-direction: column;
            
            .info-text{
                text-shadow: 0 0 1px;
                font-size: 25px;
                margin-bottom: 1rem;
                font-weight: bold;

                
                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
            }
        }
    }
}
section{
    position: absolute;
    width: 100%;
}
.bg-title{
    z-index: -1;
    position: absolute;
    opacity: 10%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
}
.top-container{
    display: flex;
    margin: 0.5rem;
    .studentProfile{
        flex: 1;

        .material-icons{
            position: relative;
            color: var(--dark);
            font-size: 2.5rem;
            top: -0.01rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 1.5rem;
            font-weight: 900;
            bottom: 0.6rem;
            left: 0.5rem;   
        }
    }
} 

.right-container {
    border-radius: 10px;
    background-color: #f0f0f0;
    padding: 0.5rem;
    flex: 0.5;
    margin-left: 1rem;
    margin-top: 150px;
    
    .top-right{
        padding: 1rem;
        background-color: #ffffff;
        margin-bottom: 2rem;
        color: black;
        width: 100%;
        height: 120px;
        border-style: solid;
        border-color: #2F3F64;
        text-align: center;

        .total-student{
            display: flex;
            flex-direction: column;
            
            .info-text{
                text-shadow: 0 0 1px;
                font-size: 25px;
                margin-bottom: 1rem;
                font-weight: bold;
                
                .material-icons{
                    position: relative;
                    font-size: 38px;
                    top:8px;
                }
                .card-2{
                    font-size: 30px;
                }
            }
            h2{
                align-self: left;
                margin-bottom: 1rem;
                font-weight: 900;
                
            }

            h3{
                font-weight: 600;
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
}

.buttom-right{
    height: 79%;
    width: 100%;
    padding: 1rem;
    background-color: #ffffff;
    margin-bottom: 2rem;
    color: black;
    border-style: solid;
    border-color: #2F3F64;
    border-width: 1px 1px 1px 1px;
    @media (min-width: 768px) {
        width: calc(100% - 1px); 
        transition: width 0.1s ease; 
    }

        .info-text{
            text-shadow: 0 0 1px;
            font-size: 25px;
            margin-bottom: 1rem;
            font-weight: bold;
            
            
            .material-icons{
                position: relative;
                font-size: 38px;
                top:8px;
            }
        }
    }

.announcement-button-container {
    position: absolute;
    flex: 0.5;
    margin-right: 1rem;
    margin-top: 4.9rem;
    border-radius: 10px;
    padding: 0.5rem;
}

.announcement-button {
    padding: 1rem 5rem;
    background-color: #2F3F64;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
}

.announcement-button:hover {
    background-color: #1A2744;
}


.info-text{
    text-shadow: 0 0 1px;
    font-size: 25px;
    margin-bottom: 1rem;
    color: var(--dark);
    font-weight: bold;
}
.material-icons{
    position: relative;
    font-size: 38px;
    top:8px;
}
</style>
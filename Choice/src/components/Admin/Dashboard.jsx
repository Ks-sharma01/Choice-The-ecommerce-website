import Layout from "./Layout"
import Chart from "react-apexcharts"
const Dashboard = () => {
          const sales = {
                    options: {
                      chart: {
                        id: 'apexchart-example'
                      },
                      xaxis: {
                        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                      }
                    },
                    series: [{
                      name: 'series-1',
                      data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
                    }]
                  }
                
                  const Profit = {
          
                    series: [{
                      name: 'Net Profit',
                      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
                    }, {
                      name: 'Revenue',
                      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                    }, {
                      name: 'Free Cash Flow',
                      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
                    }],
                    options: {
                      chart: {
                        type: 'bar',
                        height: 350
                      },
                      plotOptions: {
                        bar: {
                          horizontal: false,
                          columnWidth: '55%',
                          endingShape: 'rounded'
                        },
                      },
                      dataLabels: {
                        enabled: false
                      },
                      stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                      },
                      xaxis: {
                        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                      },
                      yaxis: {
                        title: {
                          text: '$ (thousands)'
                        }
                      },
                      fill: {
                        opacity: 1
                      },
                      tooltip: {
                        y: {
                          formatter: function (val) {
                            return "$ " + val + " thousands"
                          }
                    }}}}
                      
                    
                  
                  
          return (
                    <Layout>
                              <div className="grid md:grid-cols-4 gap-3">
                                        <div className="bg-orange-600 text-white rounded-lg shadow-lg  p-3 border flex gap-2 items-center">
                                                  <div className="space-y-1 ">
                                                            <div className=" flex justify-center items-center bg-orange-400 w-[48px] h-[48px] border border-white border-1 rounded-full shadow">
                                                                      <i class="ri-shopping-cart-line text-2xl text-white"></i>
                                                            </div>
                                                            <h1 className="text-lg font-semibold ">Products</h1>
                                                  </div>
                                                            <div className="border-r border-white h-full"></div>
                                                            <h1 className="text-2xl font-bold">{(76767).toLocaleString()}</h1>
                                        </div>
                                        <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-3 border flex gap-2 items-center">
                                                  <div className="space-y-1 ">
                                                            <div className=" flex justify-center items-center bg-indigo-400 w-[48px] h-[48px] border border-white border-1 rounded-full shadow">
                                                                      <i class="ri-shopping-basket-2-line text-2xl text-white"></i>
                                                            </div>
                                                            <h1 className="text-lg font-semibold ">Orders</h1>
                                                  </div>
                                                            <div className="border-r border-white h-full"></div>
                                                            <h1 className="text-2xl font-bold">{(85767).toLocaleString()}</h1>
                                        </div>
                                        
                                        <div className="bg-lime-600 text-white rounded-lg shadow-lg p-3 border flex gap-2 items-center">
                                                  <div className="space-y-1 ">
                                                            <div className=" flex justify-center items-center bg-lime-400 w-[48px] h-[48px] border border-white border-1 rounded-full shadow">
                                                                      <i class="ri-money-dollar-circle-line text-2xl text-white"></i>
                                                            </div>
                                                            <h1 className="text-lg font-semibold ">Payments</h1>
                                                  </div>
                                                            <div className="border-r border-white h-full"></div>
                                                            <h1 className="text-2xl font-bold">{(85767).toLocaleString()}</h1>
                                        </div>
                                        <div className="bg-rose-600 text-white rounded-lg shadow-lg p-3 border flex gap-2 items-center">
                                                  <div className="space-y-1 ">
                                                            <div className=" flex justify-center items-center bg-rose-400 w-[48px] h-[48px] border border-white border-1 rounded-full shadow">
                                                                      <i class="ri-user-line text-2xl text-white"></i>
                                                            </div>
                                                            <h1 className="text-lg font-semibold ">Customers</h1>
                                                  </div>
                                                            <div className="border-r border-white h-full"></div>
                                                            <h1 className="text-2xl font-bold">{(85767).toLocaleString()}</h1>
                                        </div>

                                        <div className="bg-white shadow rounded-lg md:col-span-2 p-6">
                                        <h1 className="text-xl font-semibold">Sales</h1>
                                        <Chart 
                                        options={sales.options}
                                        series={sales.series}
                                        height={200}
                                        />
                                        </div>
                                        <div className="bg-white shadow rounded-lg md:col-span-2 p-6">
                                        <h1 className="text-xl font-semibold">Profit</h1>
                                        <Chart 
                                        options={Profit.options}
                                        series={Profit.series}
                                        height={200}
                                        type="bar"
                                        />
                                        </div>
                                        <div className="p-6 bg-orange-600 rounded-lg shadow-lg md:col-span-4 flex md:flex-row flex-col items-center gap-6">
                                                  <div className="bg-white rounded-full  flex items-center ">
                                                  <img src="/images/avt.jpg" alt="" className="rounded-full"/>
                                                  </div>
                                                  <div>
                                                            <h1 className="text-2xl font-bold text-white">Dashboard Report & Analytics</h1>
                                                            <p className="text-gray-50">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae vitae veritatis consequuntur, sed doloremque officia. Id sit sunt, laborum quam minima repellendus totam quod dolorum magnam impedit molestias in quaerat.</p>
                                                  </div>
                                        </div>

                              </div>
                    </Layout>
          )
          }
export default Dashboard
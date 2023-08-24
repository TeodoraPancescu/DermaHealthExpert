import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios'
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

function PieChartAge(props) {
    const dispatch = useDispatch();
    const { user } = props;
    const chartRef = useRef(null);

    const getPieChartDataPacientsByAge = async () => {
        try {
            dispatch(showLoading());
            console.log("user", user);
            const response = await axios.post(
                '/api/doctor/get-chart-pacients-by-age-categories',
                { userId: user?._id, },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                createChart(response.data.data);
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };

    const createChart = (pieChartData) => {
        const chart = echarts.init(chartRef.current);

        console.log("pieChartData gender", pieChartData);

        const options = {
            title: {
                text: 'Categorii de vârsta',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: pieChartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        chart.setOption(options);
    }

    useEffect(() => {
        getPieChartDataPacientsByAge();
    }, []);

    return <div ref={chartRef} style={{ width: '50%', height: '400px', "paddingLeft": "130px" }} />;
}

export default PieChartAge;

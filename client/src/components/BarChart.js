import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios'
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

function BarChart(props) {
  const dispatch = useDispatch();
  const { user } = props;
  const chartRef = useRef(null);

  const getBarChartDataAppointmentsByMonth = async () => {
    try {
      dispatch(showLoading());
      console.log("user", user);
      const response = await axios.post(
        '/api/doctor/get-chart-appointments-by-month',
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

  const createChart = (barChartData) => {
    const chart = echarts.init(chartRef.current);

    console.log("barChartData", barChartData);

    const options = {
      title: {
        text: 'Programări pacienți an curent'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: barChartData
        }
      ]
    };

    chart.setOption(options);
  }

  useEffect(() => {
    getBarChartDataAppointmentsByMonth();

  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}

export default BarChart;
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios'
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

function PieChartGender(props) {
  const dispatch = useDispatch();
  const { user } = props;
  const chartRef = useRef(null);

  const getPieChartDataPacientsByGender = async () => {
    try {
      dispatch(showLoading());
      console.log("user", user);
      const response = await axios.post(
        '/api/doctor/get-chart-pacients-by-gender',
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
        text: 'Împărțire pacienți pe sexe',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieChartData
        }
      ]
    };

    chart.setOption(options);
  }

  useEffect(() => {
    getPieChartDataPacientsByGender();
  }, []);

  return <div ref={chartRef} style={{ width: '50%', height: '400px' }} />;
}

export default PieChartGender;

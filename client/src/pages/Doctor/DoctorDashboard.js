import React from 'react';
import BarChart from '../../components/BarChart';
import PieChartGender from '../../components/PieChartGender';
import PieChartAge from '../../components/PieChartAge';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';

function DoctorDashboard() {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout>
      <h1>Statistici programări</h1>
      <div className="dashboard-charts">
        <div className="bar-chart">
          <BarChart user={user} />
        </div>

        <div className="pie-charts">
          <PieChartGender user={user} />
          <PieChartAge user={user} />
        </div>
      </div>
    </Layout>
  );
}

export default DoctorDashboard;
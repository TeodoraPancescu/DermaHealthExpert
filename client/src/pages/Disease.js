import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card } from 'antd';

function Disease() {
  const [disease, setDisease] = useState([]);
  const dispatch = useDispatch();

  const getDiseaseData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/user/get-disease', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      console.log("response.data.data", response.data.data);
      if (response.data.success) {
        setDisease(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error('A apărut o eroare la obținerea afecțiunilor');
    }
  };

  useEffect(() => {
    getDiseaseData();
  }, []);

  const formatDescription = (description) => {
    const sentences = description.split(/[.!?:]/);
    return sentences.map((sentence, index) => <p key={index}>{sentence}</p>);
  };


  return (
    <Layout>
      <h1 className='heading'>Listă afecțiuni</h1>
      {disease.map((d) => (
        <Card title={d.name} key={d._id} style={{ marginBottom: '16px' }}>
          <p className='separare'>{d.description}</p>
          <br></br>
        </Card>
      ))}
    </Layout>
  );
}

export default Disease;

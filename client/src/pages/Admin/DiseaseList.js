import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { Button, Collapse } from 'antd';

const { Panel } = Collapse;

function DiseaseList() {
    const dispatch = useDispatch();
    const [disease, setDisease] = useState([]);
    const [newDiseaseName, setNewDiseaseName] = useState('');
    const [newDiseaseDescription, setNewDiseaseDescription] = useState('');
    const [editingDiseaseId, setEditingDiseaseId] = useState(null);

    const getDisease = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/user/get-disease', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setDisease(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    const handleDiseaseAdd = async (e) => {
        e.preventDefault();
        if (!newDiseaseDescription) {
            console.error('Descrierea este obligatorie');
            return;
        }

        try {
            dispatch(showLoading());
            const response = await axios.post(
                `/api/admin/add-disease`,
                { name: newDiseaseName, description: newDiseaseDescription },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );

            if (response.data.success) {
                setDisease([...disease, response.data.data]);
            }

            setNewDiseaseName('');
            setNewDiseaseDescription('');
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            console.error('Eroare adăugare afecțiune:', error);
        }
    };

    useEffect(() => {
        getDisease();
    }, []);

    return (
        <Layout>
            <h1 className='heading'>Listă afecțiuni</h1>
            <hr></hr>
            <div>
                <p className='custom-text'>Adaugă afecțiune</p>
                <form onSubmit={handleDiseaseAdd}>
                    <div className='input-wrapper'>
                        <input
                            type='text'
                            placeholder='Nume afecțiune'
                            value={newDiseaseName}
                            onChange={(e) => setNewDiseaseName(e.target.value)}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <input
                            type='text'
                            placeholder='Descriere afecțiune'
                            value={newDiseaseDescription}
                            onChange={(e) => setNewDiseaseDescription(e.target.value)}
                        />
                    </div>
                    <div className='button-wrapper'>
                        <Button className='butonPrincipal my-2 ' htmlType='submit'>Adaugă afecțiune</Button>
                    </div>
                </form>
                <hr></hr>
                <h1 className='heading'>Afecțiuni</h1>
                <Collapse accordion>
                    {disease.map((d) => (
                        <Panel header={d.name} key={d._id}>
                            <p>{d.description}</p>
                            <ul></ul>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </Layout>
    );
}

export default DiseaseList;

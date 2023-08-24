import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table } from 'antd';
import { toast } from 'react-hot-toast';

function DoctorsList() {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();

    const getDoctorsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/admin/get-all-doctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            toast.error('A apărut o eroare la obținerea datelor doctorilor');
        }
    };

    const changeDoctorStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/admin/change-doctor-account-status',
                { doctorId: record._id, userId: record.userId, status: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getDoctorsData();
            }
        } catch (error) {
            toast.error('Ceva nu a mers bine la schimbarea status-ului doctorului!');
            console.log(error);
            dispatch(hideLoading());
        }
    };

    const openCV = (doctor) => {
        const base64String = doctor.cvDoctor;
        const base64Data = base64String.substring(base64String.indexOf(',') + 1);

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const fileBlob = new Blob([byteArray], { type: 'application/pdf' });

        const url = URL.createObjectURL(fileBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${doctor.numeDoctor}${doctor.prenumeDoctor}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        getDoctorsData();
    }, []);

    const columns = [
        {
            title: 'Nume',
            dataIndex: 'nume',
            render: (text, record) => (
                <span>
                    {record.numeDoctor} {record.prenumeDoctor}
                </span>
            ),
        },
        {
            title: 'E-mail',
            dataIndex: 'emailDoctor',
        },
        {
            title: 'Telefon',
            dataIndex: 'numarTelefon',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'CV',
            dataIndex: 'cvDoctor',
            render: (text, record) => (
                <div>
                    <button className='butonPrincipal' onClick={() => openCV(record)}>
                        CV
                    </button>
                </div>
            ),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === 'pending' && (
                        <h1 className="anchor" onClick={() => changeDoctorStatus(record, 'aprobat')}>
                            Aprobă
                        </h1>
                    )}
                    {record.status === 'aprobat' && (
                        <h1 className="anchor" onClick={() => changeDoctorStatus(record, 'blocat')}>
                            Block
                        </h1>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="heading">Listă doctori</h1>
            <hr />
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    );
}

export default DoctorsList;

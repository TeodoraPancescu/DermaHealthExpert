import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import axios from 'axios'
import { Button, Table } from 'antd'
import { toast } from 'react-hot-toast'
import moment from 'moment'

function Appointments() {

    const [appointments, setAppointmets] = useState([])
    const dispatch = useDispatch()
    const [refreshFlag, setRefreshFlag] = useState(false);
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-appointments-by-user-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointmets(response.data.data)
            }

        } catch (error) {
            dispatch(hideLoading())
            console.log(error); // Afiseaza eroarea in consola pentru a o investiga
            toast.error("A apărut o eroare la obținerea datelor doctorilor");
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            dispatch(showLoading());
            const response = await axios.delete(`/api/user/appointments/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                // Filtreaza programarea anulată din array-ul de programări.
                const updatedAppointments = appointments.filter(
                    (appointment) => appointment._id !== appointmentId
                );
                setAppointmets(updatedAppointments);
                toast.success('Programarea a fost anulată cu succes!');
                window.location.reload(true);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            toast.error('A apărut o eroare la anularea programării');
        }
    };

    const columns = [
        {
            title: "Id Programare:",
            dataIndex: "_id"
        },
        {
            title: 'Doctor:',
            dataIndex: 'numeDoctor',
            render: (text, record) =>
                <span>
                    {record.doctorInfo.numeDoctor} {record.doctorInfo.prenumeDoctor}
                </span>
        },
        {
            title: 'E-mail Doctor:',
            dataIndex: 'emailDoctor',
            render: (text, record) =>
                <span>
                    {record.doctorInfo.emailDoctor}
                </span>
        },
        {
            title: 'Telefon contact:',
            dataIndex: 'numarTelefon',
            render: (text, record) =>
                <span>
                    {record.doctorInfo.numarTelefon}
                </span>
        },
        {
            title: 'Data și Ora:',
            dataIndex: 'createdAt',
            render: (text, record) =>
                <span>
                    {moment(record.date).format("YYYY-MM-DD")} {moment(record.ora, "HH:mm:ss").format("HH:mm:ss")}
                </span>
        },
        {
            title: "Status: ",
            dataIndex: "status",
        },
        {
            title: 'Acțiuni',
            render: (_, record) => (
                <Button onClick={() => cancelAppointment(record._id)}>Anulează</Button>
            ),
        },

    ]
    useEffect(() => {
        getAppointmentsData()
    }, []);




    return (
        <Layout>
            <h1 className='heading'>Listă programări</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default Appointments
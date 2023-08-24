import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import { Button } from 'antd';
import * as XLSX from "xlsx";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch()
    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
            }

        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            toast.error("A apărut o eroare la obținerea datelor pacientilor");
        }
    }

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/change-appointment-status', { appointmentId: record._id, status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                getAppointmentsData();
            }

        } catch (error) {
            toast.error("Ceva nu a mers bine la schimbarea status-ului programării!")
            console.log(error);
            dispatch(hideLoading())

        }
    }

    const handleOnExport = () => {
        const excelData = appointments.map(({ _id, userInfo, status, date, ora }) => (
            { id: _id, numePacient: `${userInfo.nume} ${userInfo.prenume}`, emailPacient: userInfo.email, status, date, ora }
        ));

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, "Appointments");

        XLSX.writeFile(wb, `Appointments.xlsx`);
    }

    const columns = [
        {
            title: "Id Programare:",
            dataIndex: "_id"
        },
        {
            title: 'Pacient:',
            dataIndex: 'nume',
            render: (text, record) =>
                <span>
                    {record.userInfo.nume} {record.userInfo.prenume}
                </span>
        },
        {
            title: 'E-mail Pacient:',
            dataIndex: 'email',
            render: (text, record) =>
                <span>
                    {record.userInfo.email}
                </span>
        },
        {
            title: 'Data și Ora:',
            dataIndex: 'createdAt',
            render: (text, record) =>
                <span>
                    {moment(record.date, "YYYY-MM-DD").format("YYYY-MM-DD")} {moment(record.ora, "HH:mm").format("HH:mm")}
                </span>
        },
        {
            title: "Status: ",
            dataIndex: "status",
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div className='d-flex'>
                            <h1
                                className='anchor px-2'
                                onClick={() => changeAppointmentStatus(record, 'aprobată')}
                            >
                                Aprobă
                            </h1>
                            <h1 className='anchor'
                                onClick={() => changeAppointmentStatus(record, 'refuzată')}
                            >
                                Refuză</h1>
                        </div>)}
                </div>
            ),
        },

    ]

    useEffect(() => {
        getAppointmentsData()
    }, [])

    return (
        <Layout>
            <h1 className='heading'>Listă programări</h1>
            <hr></hr>
            <Button onClick={handleOnExport}>Export</Button>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default DoctorAppointments;

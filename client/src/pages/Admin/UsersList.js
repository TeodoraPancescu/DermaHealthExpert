import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import axios from 'axios'
import { Table } from 'antd'

function UsersList() {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()
    const getUsersData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setUsers(response.data.data)
            }

        } catch (error) {
            dispatch(hideLoading())

        }
    }


    useEffect(() => {
        getUsersData()
    }, [])

    const columns = [
        {
            title: 'Nume',
            dataIndex: 'nume',
        },
        {
            title: 'Prenume',
            dataIndex: 'prenume',
        },
        {
            title: 'CNP',
            dataIndex: 'CNP',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    <h1 className='anchor'>Block</h1>

                </div>
            )
        },


    ]
    return (
        <Layout>
            <h1 className='heading'>Listă utilizatori</h1>
            <hr></hr>
            <Table columns={columns} dataSource={users} />
        </Layout>
    )
}

export default UsersList
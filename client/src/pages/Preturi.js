import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Collapse } from 'antd';

const { Panel } = Collapse;

function Prices() {

    const [categories, setCategories] = useState([])
    const dispatch = useDispatch()
    const getCategoriesData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            dispatch(hideLoading())
            console.log("response.data.data", response.data.data)
            if (response.data.success) {
                setCategories(response.data.data)
            }

        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            toast.error("A apărut o eroare la obținerea categoriilor de servicii");
        }
    }

    useEffect(() => {
        getCategoriesData()
    }, [])
    return (
        <Layout>
            <h1 className='heading'>Listă servicii și prețuri</h1>
            <Collapse accordion>
                {categories.map(category => (
                    <Panel header={category.name} key={category._id}>
                        <ul>
                            {category.services.map((service) => (
                                <li key={service._id}>{service.name}, {service.price} RON</li>
                            ))}
                        </ul>
                    </Panel>
                ))}
            </Collapse>
        </Layout>
    )
}

export default Prices
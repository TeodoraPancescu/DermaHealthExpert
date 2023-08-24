import React from 'react'
import Layout from '../components/Layout'
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

function Notificari() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const marcheazaCitite = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/marcheaza-notificari-citite", { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data));
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ceva nu a mers bine!")
        }
    }

    const stergeToateNot = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/sterge-notificari", { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data));
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ceva nu a mers bine!")
        }
    }

    return (
        <Layout>
            <h1 className='heading'>Notificări</h1>
            <hr />
            <Tabs>
                <Tabs.TabPane tab='Necitite' key={0}>
                    <div className='d-flex justify-content-end'>
                        <h1 className='anchor' onClick={() => marcheazaCitite()}>Marchează toate ca citite</h1>
                    </div>
                    {
                        user?.unseenNot.map((notification) => (
                            <div className='card3 p-2 mt-2' onClick={() => navigate(notification.onClickPath)}>
                                <div className='cardText'>{notification.message}</div>
                            </div>
                        ))
                    }
                </Tabs.TabPane>
                <Tabs.TabPane tab='Citite' key={1}>
                    <div className='d-flex justify-content-end'>
                        <h1 className='anchor' onClick={()=>stergeToateNot()}>Șterge toate notificările</h1>
                    </div>
                    {
                        user?.seenNot.map((notification) => (
                            <div className='card3 p-2 mt-2' >
                                <div className='cardText2'>{notification.message}</div>
                            </div>
                        ))
                    }
                </Tabs.TabPane>
            </Tabs>
        </Layout>


    )
}

export default Notificari;
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import DoctorForm from '../../components/DoctorForm'
import moment from "moment";

function Profil() {
    const { user } = useSelector(state => state.user);
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/update-doctor-profile",
                {
                    ...values,
                    userId: user._id,
                    oreLucru: [
                        moment(values.oreLucru[0]).format("HH:mm"),
                        moment(values.oreLucru[1]).format("HH:mm")
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/");
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ceva nu a mers bine!")
        }
    }

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/doctor/get-doctor-info-by-user-id',
                {
                    userId: params.userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });

            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }
        } catch (error) {
            console.log(error)
            dispatch(hideLoading());
        }
    };

    useEffect(() => {

        getDoctorData();

    }, []);
    const role = user?.esteAdmin ? "Admin" : user?.esteDoctor ? "Doctor" : "User";
    return (
        <Layout>
            <h1 className='heading'>Profil {role}</h1>
            <hr />

            {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
        </Layout>
    );
}

export default Profil


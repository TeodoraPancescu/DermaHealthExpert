import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DoctorForm from '../components/DoctorForm'
import moment from 'moment'

function AplicaDoctor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [doctor, setDoctor] = useState(null);

    const onFinish = async (values, selectedImage, selectedCV) => {
        try {
            dispatch(showLoading());

            // Imagine citita ca base64-encoded string
            try {
                const response = await axios.post("/api/user/aplica-cont-doctor", {
                    ...values,
                    userId: user._id,
                    oreLucru: [
                        values.oreLucru[0].format("HH:mm"),
                        values.oreLucru[1].format("HH:mm")
                    ],
                    imagineDoctor: selectedImage,
                    cvDoctor: selectedCV,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                dispatch(hideLoading());
                if (response.data.success) {
                    setDoctor(response.data.doctor)
                    toast.success(response.data.message)
                    // toast("Redirecționare către pagina de Înregistrare");
                    navigate("/");
                }
                else {
                    toast.error(response.data.message);

                }

            } catch (error) {
                console.error('Error uploading image:', error);
            }

        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ceva nu a mers bine!")
        }
    }
    return (
        <Layout>
            <h1 className='heading'>Aplică ca doctor și hai în echipa noastră de specialiști!</h1>
            <hr></hr>

            <DoctorForm onFinish={onFinish} doctor={doctor} />

        </Layout>
    )
}

export default AplicaDoctor;
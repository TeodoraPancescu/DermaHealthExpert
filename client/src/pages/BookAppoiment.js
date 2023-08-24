import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Row, Select, TimePicker } from 'antd';
import StripeCheckout from "react-stripe-checkout";

function BookAppoiment() {
    const [esteDisponibil, setEsteDisponibil] = useState(false);
    const navigate = useNavigate();
    const [date, setDate] = useState();
    const [ora, setOra] = useState();
    const params = useParams();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState(null);
    const { user } = useSelector((state) => state.user);
    const [services, setServices] = useState([]);
    const [aPlatit, setAPlatit] = useState(false);
    const [selectedServicePrice, setSelectedServicePrice] = useState(0);
    const [transactionId, setTransactionId] = useState(null);


    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/doctor/get-doctor-info-by-id',
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
                const categoriesResponse = await axios.get('/api/user/get-categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (categoriesResponse.data.success) {
                    const categories = categoriesResponse.data.data;
                    const doctorCategory = categories.find(category => category.name === response.data.data.serviciiOferite);
                    console.log("doctorCategory", doctorCategory)
                    console.log("doctor", response.data.data)
                    console.log("doctorServicii", response.data.data.serviciiOferite)
                    setServices(doctorCategory.services);
                }
                setDoctor(response.data.data);
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };

    const checkAvailability = async () => {
        if (date && ora) {
            try {
                dispatch(showLoading());
                const response = await axios.post(
                    '/api/user/check-booking-availability',
                    {
                        doctorId: params.doctorId,
                        date: date,
                        ora: ora,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                dispatch(hideLoading());
                if (response.data.success) {
                    toast.success(response.data.message);
                    setEsteDisponibil(true);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Ceva nu a mers bine la verificarea disponibilității!');
                dispatch(hideLoading());
            }
        }
    };


    const bookNow = async () => {
        if (aPlatit) {
            setEsteDisponibil(false);
            try {
                dispatch(showLoading());
                const response = await axios.post(
                    '/api/user/book-appointment',
                    {
                        doctorId: params.doctorId,
                        userId: user._id,
                        doctorInfo: doctor,
                        userInfo: user,
                        date: date,
                        ora: ora,
                        transactionId: transactionId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                dispatch(hideLoading());
                if (response.data.success) {
                    toast.success(response.data.message);
                    navigate('/appointments');
                }
            } catch (error) {
                toast.error('Ceva nu a mers bine la crearea programării!');
                dispatch(hideLoading());
            }
            console.log('Rezervare realizată cu succes!');
        } else {
            console.log('Vă rugăm să finalizați plata înainte de a efectua rezervarea.');
        }
    };

    const onToken = async (token) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/make-payment", {
                token,
                amount: selectedServicePrice * 100 * 0.2,
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            dispatch(hideLoading());
            if (response.data.success) {
                setTransactionId(response.data.data.transactionId);
                toast.success(response.data.message);
                bookNow(response.data.data.transactionId);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error(error.message);
        }
        setAPlatit(true);
    };

    const setDisabledHours = (oreLucru) => {
        console.log(oreLucru)
        const oraInceput = parseInt(oreLucru[0].split(":")[0])
        const oraFinal = parseInt(oreLucru[1].split(":")[0])
        const disabledHours = []
        for (let i = 0; i <= 24; i++) {
            if (i < oraInceput || i > oraFinal) {
                disabledHours.push(i)
            }
        }
        return disabledHours;

    }

    useEffect(() => {
        getDoctorData();
    }, []);

    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className="page-title">
                        {doctor.numeDoctor} {doctor.prenumeDoctor}
                    </h1>
                    <hr />
                    <Row gutter={20} className="mt-5" align="middle">
                        <Col span={12} sm={24} xs={24} lg={8}>
                            <h1 className="normal-text">
                                <b>Ore de lucru medic ales: </b>
                                {doctor.oreLucru[0]} - {doctor.oreLucru[1]}
                            </h1>
                            <img
                                src={doctor.imagineDoctor}
                                alt={`${doctor.numeDoctor} ${doctor.prenumeDoctor}`}
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                            <p className="card-text"><b>Număr contact: </b>{doctor.numarTelefon}</p>
                            <p className="card-text"><b>Servicii oferite: </b>{doctor.serviciiOferite}</p>
                            <p className="card-text"><b>Descriere profesională: </b>{doctor.experienta}</p>
                            <hr></hr>
                            <Form.Item
                                className="formItemFormat"
                                required
                                label="Tip servicii oferite"
                                name="serviciiOferite"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    className="custom-select"
                                    placeholder="Introduceți tipul serviciului dorit"
                                    style={{ width: "450px" }}
                                    onChange={(value) => {
                                        const selectedService = services.find(service => service._id === value);
                                        setSelectedServicePrice(selectedService ? selectedService.price : 0);
                                    }}
                                >
                                    {services.map((service) => (
                                        <Select.Option key={service._id} value={service._id}>
                                            {service.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <div className="d-flex flex-column pt-2 mt-2">
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    onChange={(value) => {
                                        const formattedDate = value ? value.format("YYYY-MM-DD") : null;
                                        console.log("Data selectată:", formattedDate);

                                        setDate(formattedDate);
                                        setEsteDisponibil(false);
                                    }}
                                />

                                <TimePicker
                                    format="HH:mm"
                                    disabledHours={() => setDisabledHours(doctor.oreLucru)}
                                    className="mt-3"
                                    onChange={(value) => {
                                        const formattedTime = value ? value.format("HH:mm") : null;
                                        console.log("Ora selectată:", formattedTime);
                                        setOra(formattedTime);
                                        setEsteDisponibil(false);

                                    }}
                                />


                                {!esteDisponibil && (
                                    <Button
                                        className="butonPrincipal mt-3 full-width-buton"
                                        onClick={checkAvailability}
                                    >
                                        Verifică disponibilitatea
                                    </Button>
                                )}
                                <div>
                                    <div>
                                        {esteDisponibil && !aPlatit && (
                                            <StripeCheckout
                                                billingAddress
                                                token={onToken}
                                                amount={parseFloat((selectedServicePrice * 100 * 0.2).toFixed(2))}
                                                currency="RON"
                                                stripeKey="pk_test_51NKodjC3q6Bx6qtt6rK9G1F2zzf1Dyc01LxR9x5gttSPUJnLwEtT1JG629Bb9niBPDASfrrGZS8yqRhuDjWGUDLe00Vz8ZyTob"
                                            >
                                                <Button
                                                    className="butonPrincipal mt-3 full-width-buton"
                                                >
                                                    Plătește avansul ({selectedServicePrice * 0.2} RON)
                                                </Button>
                                            </StripeCheckout>

                                        )}
                                        {aPlatit && (
                                            <Button
                                                className="butonPrincipal mt-3 full-width-buton"
                                                onClick={bookNow}
                                            >
                                                Programează-te
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={12} sm={24} xs={24} lg={8}>
                        </Col>
                    </Row>
                    <p className='custom-text'>
                        Pentru a face o programare se percepe un avans de 20% din costul serviciului ales!
                    </p>
                </div>
            )}
        </Layout>
    );
}

export default BookAppoiment;

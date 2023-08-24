import React from 'react';
import { Button, Form, Input } from 'antd';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser, reloadUserData } from "../redux/userSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getUser = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/get-user-info-by-id', { token: localStorage.getItem('token') }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            }
            else {
                localStorage.clear()
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            localStorage.clear();
            navigate('/login');
        }

    }
    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post("/api/user/login", values);
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                // toast("Trimitere catre pagina principala");
                localStorage.setItem("token", response.data.data);

                getUser()
                navigate("/");
            }
            else {
                dispatch(hideLoading())
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Ceva nu a mers bine!")
        }
    }
    return (
        <div className='inregistrare'>
            <div className='formular-inregistrare card2 p-3'>
                <h1 className='card-titlu'>Bine ați revenit!</h1>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item label='Adresă de email' name='email'>
                        <Input placeholder='Introduceți adresa de email' />
                    </Form.Item>
                    <Form.Item label='Parola' name='parola'>
                        <Input placeholder='Introduceți parola' type='password' />
                    </Form.Item>

                    <Button className='butonPrincipal my-2 full-width-buton' htmlType='submit'>Autentificare</Button>
                    <Link to='/register' className='anchor mt-2'>Nu ai cont? Înregistrează-te aici!</Link>

                </Form>

            </div>
        </div>
    )
}

export default Login
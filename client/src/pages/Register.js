import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCNPValid, setIsCNPValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/register', values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
        dispatch(hideLoading());
      }
    } catch (error) {
      toast.error('Ceva nu a mers bine!');
    }
  };

  const validateCNP = (_, value) => {
    if (value && value.length !== 13) {
      setIsCNPValid(false);
      return Promise.reject('CNP trebuie să conțină 13 caractere!');
    }
    setIsCNPValid(true);
    return Promise.resolve();
  };

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setIsEmailValid(false);
      return Promise.reject('Adresa de email nu are formatul valid!');
    }
    setIsEmailValid(true);
    return Promise.resolve();
  };

  return (
    <div className="inregistrare">
      <div className="formular-inregistrare card2 p-3">
        <h1 className="card-titlu">Bine ați venit!</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Nume" name="nume">
            <Input placeholder="Introduceți numele" />
          </Form.Item>
          <Form.Item label="Prenume" name="prenume">
            <Input placeholder="Introduceți prenumele" />
          </Form.Item>
          <Form.Item
            label="CNP"
            name="CNP"
            rules={[{ validator: validateCNP }]}
          >
            <Input placeholder="Introduceți codul numeric personal" />
          </Form.Item>
          <Form.Item
            label="Adresă de email"
            name="email"
            rules={[{ validator: validateEmail }]}
          >
            <Input placeholder="Introduceți adresa de email" />
          </Form.Item>
          <Form.Item label="Parola" name="parola">
            <Input placeholder="Introduceți parola" type="password" />
          </Form.Item>
          <Button
            className="butonPrincipal my-2 full-width-buton"
            htmlType="submit"
            disabled={!isCNPValid || !isEmailValid}
          >
            Înregistrare
          </Button>
          <Link to="/login" className="anchor mt-2">
            Ai deja un cont? Autentifică-te aici!
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;

import { Button, Col, Input, Row, Select, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice'
import { toast } from 'react-hot-toast';

function DoctorForm({ onFinish, initialValues, doctor }) {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedCV, setSelectedCV] = useState(null);

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return Promise.reject('Introduceți o adresă de email validă!');
    }
    return Promise.resolve();
  };

  const validatePhoneNumber = (_, value) => {
    if (value && value.replace(/\D/g, '').length !== 10) {
      return Promise.reject('Numărul de telefon trebuie să conțină exact 10 cifre!');
    }
    return Promise.resolve();
  };

  const handleFinish = async (values) => {
    try {
      await form.validateFields(); // Verifică și validează toate câmpurile formularului

      await onFinish(values, selectedImage, selectedCV, selectedCategory);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBeforeUpload = (file) => {
    return false;
  };

  const handleChange = (info) => {
    const { fileList } = info;

    if (fileList.length > 0) {
      const imageFile = fileList[0].originFileObj;

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setSelectedImage(imageData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setSelectedImage(null);
    }
  };

  const handleChangeCV = (event) => {
    const CVFile = event.fileList[0].originFileObj;

    const reader = new FileReader();
    reader.onloadend = () => {
      const CVData = reader.result;
      setSelectedCV(CVData);
    };

    if (CVFile) {
      reader.readAsDataURL(CVFile);
    } else {
      setSelectedCV(null);
    }
  };

  const getCategories = () => {
    axios.get('/api/user/get-categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        if (response.data.success) {
          setCategories(response.data.data);
          // console.log(response.data)
          // console.log(categories)
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleChangeSelectCategory = (value) => {
    setSelectedCategory(value);
    console.log('Categoria selectata:', value);
  };

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        ...(initialValues && {
          oreLucru: [
            moment(initialValues?.oreLucru[0], 'HH:mm'),
            moment(initialValues?.oreLucru[1], 'HH:mm'),
          ],
        }),
      }}
    >
      <h1 className="card-titlu mt-3">Informații personale</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nume"
            name="numeDoctor"
            rules={[{ required: true }]}
          >
            <Input placeholder="Introduceți numele" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Prenume"
            name="prenumeDoctor"
            rules={[{ required: true }]}
          >
            <Input placeholder="Introduceți prenumele" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="E-mail"
            name="emailDoctor"
            rules={[
              { required: true },
              { validator: validateEmail },
            ]}
          >
            <Input placeholder="Introduceți adresa de e-mail" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Număr de telefon"
            name="numarTelefon"
            rules={[
              { required: true },
              { validator: validatePhoneNumber },
            ]}
          >
            <Input placeholder="Introduceți numărul dumneavoastră de telefon" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-titlu mt-3">Informații profesionale</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Tip servicii oferite"
            name="serviciiOferite"
            rules={[{ required: true }]}
          >
            {categories && categories.length > 0 ? (
              <Select
                placeholder="Introduceți tipul serviciilor oferite"
                onChange={handleChangeSelectCategory}
                value={selectedCategory}
              >
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <p>Loading categories...</p>
            )}
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experiența"
            name="experienta"
            rules={[{ required: true }]}
          >
            <Input placeholder="Introduceți experiența dumneavoastră de-a lungul carierei" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Pret Serviciu"
            name="pretServiciu"
            rules={[{ required: true }]}
          >
            <Input placeholder="Introduceți prețul serviciului oferit" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Ore de lucru disponibile pe zi"
            name="oreLucru"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Imagine"
            name="imagineDoctor"
            valuePropName="fileListProp"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: 'Selectați o imagine' }]}
          >
            <Upload.Dragger name="imagineDoctor" beforeUpload={handleBeforeUpload} onChange={handleChange}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Faceți clic sau trageți o imagine în această zonă</p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="CV"
            name="cvDoctor"
            valuePropName="fileListProp"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: 'Selectați un CV' }]}
          >
            <Upload.Dragger
              name="cvDoctor"
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeCV}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Faceți clic sau trageți un CV în această zonă</p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button
          className="butonPrincipal"
          htmlType="submit"
          disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
        >

          Trimitere
        </Button>
      </div>

    </Form>
  );
}

export default DoctorForm;


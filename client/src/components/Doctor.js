import { Button } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Doctor({ doctor }) {
    const navigate = useNavigate();

    const handleCategories = () => {
        if (doctor.categories && doctor.categories.length > 0) {
            return doctor.categories.map(category => (
                <span key={category._id}>{category.name}, </span>
            ));
        } else {
            return <span>Nu a fost găsită nicio categorie</span>;
        }
    };

    return (
        <div className='card p-2 mb-3'>
            <div className='card-title-doctor'>
                <h1 className='doctor-title heading'>{doctor.numeDoctor} {doctor.prenumeDoctor}</h1>
                <div>
                    <img
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginLeft: '40px'
                        }}
                        src={doctor.imagineDoctor} alt="imagine-doctor" />
                </div>
            </div>
            <hr />
            <p className="card-text"><b>Număr contact: </b>{doctor.numarTelefon}</p>
            <p className="card-text">
                <b>Servicii oferite: </b>
                {doctor.serviciiOferite}
            </p>
            <p className="card-text"><b>Descriere profesională: </b>{doctor.experienta}</p>
            <p className="card-text"><b>Ore lucru: </b>{doctor.oreLucru[0]} - {doctor.oreLucru[1]}</p>

            <div className="d-flex justify-content-between">
                <Button className='butonPrincipal my-2' htmlType='submit' onClick={() => navigate(`/book-appointment/${doctor._id}`)}>Programează-te</Button>
                <Button className='butonPrincipal my-2' htmlType='submit' onClick={() => navigate(`/recenzii/${doctor._id}`)}>Recenzii</Button>
            </div>
        </div>
    );
}

export default Doctor;

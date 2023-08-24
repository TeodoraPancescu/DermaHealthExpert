import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { Button, Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Rate } from 'antd';
import { StarFilled } from '@ant-design/icons';

function Reviews() {
    const dispatch = useDispatch()
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const { user } = useSelector((state) => state.user);
    const [rating, setRating] = useState(0);

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
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
        }
    };
    const getReviews = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/get-reviews',
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            dispatch(hideLoading())
            if (response.data.success) {
                setReviews(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    };

    const handleReviewsAdd = async () => {
        try {
            dispatch(showLoading())
            console.log(user._id)
            const response = await axios.post(`/api/user/add-reviews`,
                { description: newReview, doctorId: doctor._id, userId: user._id, ratingNumber: rating },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },

                });

            if (response.data.success) {
                setReviews([...reviews, response.data.data]);
            }

            setNewReview('');
            dispatch(hideLoading())
        } catch (error) {
            dispatch(hideLoading())
            console.error('Eroare la adăugarea review-ului:', error);
        }
    };

    const handleRatingChange = (rating) => {
        setRating(rating);
        console.log(rating)
    };


    useEffect(() => {
        getDoctorData();
        getReviews()
    }, [])

    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className='page-header'>Listă recenzii doctor {doctor.numeDoctor} {doctor.prenumeDoctor}</h1>
                    <hr />
                    <div>
                        <h3>Adaugă recenzie nouă</h3>
                        <form onSubmit={handleReviewsAdd}>
                            <input
                                type="text"
                                placeholder="Adaugă recenzie"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                            />
                            <Rate
                                allowHalf
                                defaultValue={rating}
                                character={<StarFilled />}
                                onChange={handleRatingChange}
                            />
                            <Button className='butonPrincipal my-2 ' htmlType='submit'>Adaugă Recenzie</Button>
                        </form>
                        <br></br>
                        <h2>Recenzii</h2>
                        {reviews.map((review) => (
                            <Card key={review._id}>
                                {review.userId ? (
                                    <div>
                                        <p>{review.userId.nume} {review.userId.prenume}</p>
                                        <p>{review.description}</p>
                                    </div>
                                )
                                    : (<div>
                                        <p>{review.description}</p>
                                    </div>)
                                }
                                <Rate
                                    allowHalf
                                    defaultValue={review.ratingNumber}
                                    character={<StarFilled />}
                                    disabled
                                />
                            </Card>

                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Reviews
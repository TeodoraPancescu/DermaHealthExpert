import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import index from '../../index'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { showLoading, hideLoading } from '../../redux/alertsSlice'
import { Button } from 'antd'

function CategoriesList() {

    const dispatch = useDispatch()
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [newServiceName, setNewServiceName] = useState('');
    const [newServicePrice, setNewServicePrice] = useState(0);

    const getCategories = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-categories', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            dispatch(hideLoading())
            if (response.data.success) {
                setCategories(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    };

    const handleCategoryAdd = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`/api/admin/add-category`,
                { name: newCategoryName },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },

                });

            if (response.data.success) {
                setCategories([...categories, response.data.data]);
            }

            setNewCategoryName('');
            dispatch(hideLoading())
        } catch (error) {
            dispatch(hideLoading())
            console.error('Eroare la adăugare categorie:', error);
        }
    };

    const handleServiceAdd = async (categoryId) => {
        try {
            const category = categories.find((category) => category._id === categoryId);
            if (!category) {
                console.error('Categoria nu a fost găsită');
                return;
            }

            const response = await axios.post(`/api/admin/add-service`,
                { name: newServiceName, price: newServicePrice, categoryId: categoryId },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });


            if (response.data.success) {
                const updatedCategories = categories.map((category) => {
                    if (category.id === categoryId) {
                        return { ...category, services: [...category.services, response.data.data] };
                    }
                    return category;
                });
                setCategories(updatedCategories);
            }

            setNewServiceName('');
            setNewServicePrice(0);
        } catch (error) {
            console.error('Eroare la adăugare serviciu:', error);
        }
    };




    useEffect(() => {
        getCategories()
    }, [])


    return (
        <Layout>
            <h1 className="heading">Listă categorii</h1>
            <hr></hr>
            <div>


                <p className='custom-text'>Adaugă categorie nouă</p>
                <form onSubmit={handleCategoryAdd}>
                    <input
                        type="text"
                        placeholder="Denumire Categorie"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button className='butonPrincipal my-2 ' htmlType='submit'>Adaugă categorie</Button>
                </form>
                <br></br>
                <hr></hr>
                <h1 className='heading'>Categorii</h1>
                {categories.map((category) => (
                    <div key={category._id}>
                        <p className='custom-text'>{category.name}</p>
                        <ul className='custom-text2'>
                            {category.services.map((service) => (
                                <li key={service._id}>{service.name}, {service.price} RON</li>
                            ))}
                        </ul>

                        {editingCategoryId === category._id ? (
                            <div>
                                <p>Adaugă serviciu</p>
                                <form onSubmit={() => handleServiceAdd(category._id)}>
                                    <input
                                        type="text"
                                        placeholder="Nume serviciu"
                                        value={newServiceName}
                                        onChange={(e) => setNewServiceName(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Preț Serviciu (RON)"
                                        value={newServicePrice}
                                        onChange={(e) => setNewServicePrice(e.target.value)}
                                    />
                                    <Button className='butonPrincipal my-2 ' htmlType='submit'>Adaugă serviciu</Button>
                                </form>
                            </div>
                        ) : (
                            <Button className='butonPrincipal my-2 ' onClick={() => setEditingCategoryId(category._id)}>Adaugă serviciu nou</Button>
                        )}
                        <hr></hr>

                    </div>
                ))}
            </div>
        </Layout>

    )
}

export default CategoriesList
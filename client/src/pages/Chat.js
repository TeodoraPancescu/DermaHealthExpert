import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import ChatContainer from "../components/ChatContainer";
import ChatContacts from "../components/ChatContacts";
import Layout from '../components/Layout';

export default function Chat() {
    const dispatch = useDispatch();
    const socket = useRef();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);

    const getUser = async () => {
        dispatch(showLoading());
        const response = await axios.post(
            '/api/user/get-user-info-by-id',
            { token: localStorage.getItem('token') },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        dispatch(hideLoading());
        if (response.data.success) {
            setCurrentUser(response.data.data);
            await getContactsList(response.data.data);
        }

    };

    const getContactsList = async (user) => {

        dispatch(showLoading());
        console.log("currentUser", user);
        console.log("currentUser.esteDoctor", user.esteDoctor);
        if (user) {
            const endpoint = user.esteDoctor
                ? '/api/user/get-all-users-pacients'
                : '/api/user/get-all-users-doctors';
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                console.log("response", response.data.data);
                setContacts(response.data.data);
            }
        }

    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io("http://localhost:3000");
            socket.current.emit("add-user", currentUser._id);
            console.log("socket", socket)
        }
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Layout>
            <Container>
                <div className="container">
                    {currentUser && (
                        <>
                            {contacts && contacts.length > 0 && (
                                <ChatContacts
                                    contacts={contacts}
                                    currentUser={currentUser}
                                    changeChat={handleChatChange}
                                />
                            )}
                            {currentChat !== undefined && (
                                <ChatContainer
                                    currentChat={currentChat}
                                    currentUser={currentUser}
                                    socket={socket}
                                />
                            )}
                        </>
                    )}
                </div>
            </Container>
        </Layout>
    );

}
const Container = styled.div`
 
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;
  .container {
    height: 89vh;
    width: 100%;
    margin-left: 0px;
    display: grid;
    grid-template-columns: 25% 75%;
    max-width: 1510px;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
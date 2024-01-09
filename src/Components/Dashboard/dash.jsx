import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import "./Dash.css";
import Selectlang from './selectlang';
import Code from './code';
import io from 'socket.io-client';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Users from './users.jsx';
import LogoutIcon from '@mui/icons-material/Logout';


function Dash() {
    const navigate = useNavigate();
    var socket;
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [providesocket, setSocketSetter] = useState(undefined);
    const [usernames, setUsernames] = useState(undefined);
    const [check, setCheck] = useState(false);


    //retrieve username and id;
    const username = localStorage.getItem('name');
    const location = useLocation();
    const id = location.pathname.split('/')[2];

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };
    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    useEffect(() => {

        if (id && username && !check) {
            socket = io('http://localhost:3000/');  ////////start point and using this socket we can use socket.xyz///////
            socket.emit('Update_users', { id, username });
            setSocketSetter(socket);
            setCheck(true);
        }

    }, []);

    useEffect(() => {

        socket?.on('User list for frontend', (usernames) => {
            setUsernames(usernames);
        });

    }, [socket]);

    useEffect(() => {

        socket?.on('New user joined', (username) => {
            toast(`${username} joined the room`);
        });
        socket?.on('User left the room', (username) => {
            toast(`${username} left the room`);
        });

    }, [socket]);

    const logoutt = () => {
        console.log('1');
        navigate('/');
        window.location.reload();
    }


    return (
        <div className='flex'>
            <section className='w-1/2'>

                <Code language={selectedLanguage} sockett={providesocket} onCodeChange={handleCodeChange} />

            </section>
            <span className="divider" />
            <section className='w-1/2'>
                <Splitter style={{ height: '100vh' }} layout="vertical">
                    <SplitterPanel className="flex align-items-center justify-content-center bg-gray-600" size={20} minSize={20}>
                        <Selectlang sockett={providesocket} onChange={handleLanguageChange} />
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center bg-gray-700" size={80} minSize={50}>
                        <div className='onlineUsers' >
                            {usernames?.map((name, key) => {
                                return (
                                    <Users initials={`${name[0] + name[1]}`} key={key} />
                                )
                            })}
                        </div>
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center bg-gray-600" size={10} minSize={10}>
                    <div className='logoutSection'>
                        <div className='logoutBackground'>
                            <LogoutIcon className='logoutIcon' onClick={logoutt} />
                        </div>
                    </div>
                    </SplitterPanel>
                </Splitter>
            </section>
        </div>
    );
}

export default Dash;

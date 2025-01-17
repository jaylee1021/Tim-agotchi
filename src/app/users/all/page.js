'use client';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import styles from '@/app/profile.module.css';
import axios from 'axios';
import { LoadingCircle } from '@/app/components/Loading';
import AllUsers from '@/app/components/AllUsers';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import setAuthToken from '@/app/utils/setAuthToken';

export default function ProfileTest() {
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setAuthToken(localStorage.getItem('jwtToken'));
        if (localStorage.getItem('jwtToken')) {
            axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`)
                .then((response) => {
                    let userData = jwtDecode(localStorage.getItem('jwtToken'));
                    if (userData.email === localStorage.getItem('email')) {
                        const fetchUserData = async () => {
                            try {
                                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`);
                                setUsers(response.data.users);
                                setIsLoading(false);
                            } catch (error) {
                                console.log('Error fetching user data', error);
                            }
                        };

                        fetchUserData();

                    } else {
                        router.push('/users/login');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    router.push('/users/login');
                });
        } else {
            router.push('/users/login');
        }
    }, [router, userId]);

    if (isLoading) return (<LoadingCircle />);

    let rows = [];
    users.forEach((user, index) => {
        if (user._id !== userId) {
            rows.push(<AllUsers user={user} key={index} />);
        }
    });

    return (
        <>
            <title>tim-agotchi - View All Users</title>
            <div id={styles.backgroundImage}></div>
            <section className='mt-4 mb-4' id={styles.viewAllUsers}>
                {rows}
            </section >
        </>
    );
};
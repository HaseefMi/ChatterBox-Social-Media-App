import { useState, useContext, useEffect } from 'react';
import CreatePost from '../create-post/post';
import { HomeAuth } from '../../contexts/home-auth-context';
import { useNavigate } from 'react-router-dom';
import Feed from '../../components/feed/feed'
import FooterNav from '../footer-nav/footer-nav';

import './home-page.css'

function HomePage() {
    const navigate = useNavigate()
    const {isAuth} = useContext(HomeAuth)
    useEffect(() => {
        if (!isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    return (
        <div>
            <Feed />
            <FooterNav />
        </div>
    );
}

export default HomePage;

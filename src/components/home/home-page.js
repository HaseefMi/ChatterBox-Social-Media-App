import { useState, useContext, useEffect } from 'react';
import CreatePost from '../create-post/post';
import { HomeAuth } from '../../contexts/home-auth-context';
import { useNavigate } from 'react-router-dom';
import Feed from '../../components/feed/feed'
import SearchIcon from '../../assets/search-icon.png'
import PostImg from '../../assets/create-post.png'
import HomeIcon from '../../assets/home-icon.png'
import AccountIcon from '../../assets/account-icon.png'

import './home-page.css'

function HomePage() {
    const navigate = useNavigate()
    const {isAuth} = useContext(HomeAuth)
    useEffect(() => {
        if (!isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    const [isPostOpen, setIsPostOpen] = useState(false);    

    return (
        <div>
            <Feed />
            {isPostOpen && <CreatePost />}
            <div className='footer-nav'>
                <img src={HomeIcon} onClick={() => navigate('/home')}/>
                <img src={PostImg} onClick={() => setIsPostOpen(!isPostOpen)} />
                <img src={SearchIcon} />
                <img src={AccountIcon} />
            </div>
        </div>
    );
}

export default HomePage;

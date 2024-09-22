import { useState, useContext, useEffect } from 'react';
import CreatePost from '../create-post/post';
import { HomeAuth } from '../../contexts/home-auth-context';
import { useNavigate } from 'react-router-dom';
import Feed from '../../components/feed/feed'
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
    const openPost = () => {
        setIsPostOpen(!isPostOpen);
    };

    return (
        <div>
            <h1 className='title'>ChatterBox Home</h1>
           <button className='create-button'type='button' onClick={openPost}>Create Post</button>
            {isPostOpen && <CreatePost />}
            <Feed />
        </div>
    );
}

export default HomePage;

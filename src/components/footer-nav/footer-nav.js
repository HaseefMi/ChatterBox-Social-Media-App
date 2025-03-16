import './footer-nav.css'
import SearchIcon from '../../assets/search-icon.png'
import PostImg from '../../assets/create-post.png'
import HomeIcon from '../../assets/home-icon.png'
import AccountIcon from '../../assets/account-icon.png'
import { useNavigate } from 'react-router-dom'

function FooterNav() {
    const navigateTo = useNavigate()

    const navigate = (path) => {
        navigateTo(path)
    }

    return (
        <div className='footer-nav'>
                <img src={HomeIcon} onClick={() => navigate('/home')}/>
                <img src={PostImg} onClick={() => navigate('/create-post')} />
                <img src={SearchIcon} />
                <img src={AccountIcon} onClick={() => navigate('/profile')}/>
            </div>
    )
}

export default FooterNav
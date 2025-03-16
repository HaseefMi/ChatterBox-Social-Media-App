import { useState, useEffect, useContext } from 'react';
import './feed.css';
import { collection, getDocs, query, limit, addDoc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase-utils';
import { Timestamp } from 'firebase/firestore';
import Likes from '../likes/likes';
import Logo from '../../assets/chatterbox-logo.png'
import { UserContext } from '../../contexts/user-context';

function Feed() {
    const [feedItems, setFeedItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [followStatus, setFollowStatus] = useState({}); 
    const { userInfo } = useContext(UserContext);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const checkFollow = async (followId) => {
        const q = query(
            collection(db, 'Followers'),
            where('follower_id', '==', userInfo['uid']),
            where('account_followed', '==', followId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; 
    };

    const handleFollow = async (followId) => {
        try {
            const isFollowing = await checkFollow(followId);
            if (isFollowing) {
                const q = query(
                    collection(db, 'Followers'),
                    where('follower_id', '==', userInfo['uid']),
                    where('account_followed', '==', followId)
                );
                const querySnapshot = await getDocs(q);
                const docToDelete = querySnapshot.docs[0]; 
    
                if (docToDelete) {
                    await deleteDoc(docToDelete.ref); 
                    alert('Successfully Unfollowed');
                    setFollowStatus(prevState => ({ ...prevState, [followId]: false })); 
                }
                
            } else {
                await addDoc(collection(db, 'Followers'), {
                    'follower_id': userInfo['uid'],
                    'account_followed': followId,
                });
                alert('Successfully Followed');
                setFollowStatus(prevState => ({ ...prevState, [followId]: true }));
            }
        } catch (error) {
            alert('Error: ' + error.message);
            console.log(error);
        }
    };
    

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const q = query(collection(db, 'Posts'), limit(50));
                const querySnapshot = await getDocs(q);
                const itemsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    if (data.createdAt instanceof Timestamp) {
                        data.createdAt = data.createdAt.toDate().toLocaleString();
                    }
                    return {
                        id: doc.id,
                        ...data
                    };
                });
                itemsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFeedItems(itemsList);
            } catch (error) {
                console.log("Error Fetching Feed: ", error.message);
            }
        };

        fetchItems();
    }, [refresh]);

    useEffect(() => {
        const checkAllFollows = async () => {
            const followStatusObj = {};
            for (let item of feedItems) {
                const isFollowing = await checkFollow(item.user_id);
                followStatusObj[item.user_id] = isFollowing;
            }
            setFollowStatus(followStatusObj); 
        };

        checkAllFollows();
    }, [feedItems]); 

    return (
        <div className="feed-container">
            <div className='feed-banner'>
                <img src={Logo} className='feed-logo' onClick={handleRefresh} />
            </div>
            <ul className="feed-items">
                {feedItems.map(item => (
                    <li className="feed-item" key={item.id}>
                        <div className='username-follow'>
                        <h3>{item.userName}</h3>
                        <button className='follow-button'
                            onClick={() => handleFollow(item.user_id)}
                        >
                            {followStatus[item.user_id] ? 'Unfollow' : 'Follow'}
                        </button>
                        </div>
                        <p>{item.postText}</p>
                        {item.imageUrl && <img src={item.imageUrl} alt="Post image" />}
                        <div className="icons-container">
                            <Likes id={item.id} />
                            <p>🗨️3</p>
                        </div>
                        <p className="timestamp">{item.createdAt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Feed;
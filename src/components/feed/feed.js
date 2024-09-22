import { useState, useEffect } from 'react';
import './feed.css';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../utils/firebase-utils';
import { Timestamp } from 'firebase/firestore';
import Likes from '../likes/likes';

function Feed() {
    const [feedItems, setFeedItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const handleRefresh = () => {
        setRefresh(!refresh);
    };


    const handleSearch = (e) => {
        
    }
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
                itemsList.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setFeedItems(itemsList);
            } catch (error) {
                console.log("Error Fetching Feed: ", error.message);
            }
        };
        fetchItems();
    }, [refresh]);

    return (
        <div className="feed-container">
            <h2 className="feed-header">For You Page</h2>
            <button type="button" className="feed-refresh-button" onClick={handleRefresh}>Refresh Feed</button>
            <ul className="feed-items">
                {feedItems.map(item => (
                    <li className="feed-item" key={item.id}>
                        <h3>{item.userName}</h3>
                        <p className="timestamp">{item.createdAt}</p>
                        <p>{item.postText}</p>
                        {item.imageUrl && <img src={item.imageUrl} alt="Post image" />}
                        <div className="icons-container">
                            <Likes id={item.id} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Feed;

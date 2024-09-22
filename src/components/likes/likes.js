import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase-utils';
import './likes.css'
function Likes({ id }) {
    const [likes, setLikes] = useState(0);
    const [canLike, setCanLike] = useState(true)

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const postDocRef = doc(db, 'Posts', id);
                const postDoc = await getDoc(postDocRef);
                if (postDoc.exists()) {
                    setLikes(postDoc.data().likes || 0);
                }
            } catch (e) {
                console.error("Error fetching likes: ", e);
            }
        };
        
        fetchLikes();
    }, [id]);

    const addLike = async () => {
        if (!canLike) {
            return;
        }
        try {
            const postDocRef = doc(db, 'Posts', id);
            const postDoc = await getDoc(postDocRef);

            if (postDoc.exists()) {
                const currentLikes = postDoc.data().likes || 0;
                await updateDoc(postDocRef, { likes: currentLikes + 1 });
                setLikes(currentLikes + 1);
                setCanLike(false)
            } else {
                await setDoc(postDocRef, { likes: 1 });
                setLikes(1);
            }
        } catch (e) {
            console.error("Error adding like: ", e);
        }
    };

    return (
        <div>
            <span onClick={addLike}>❤️ {likes}</span>
        </div>
    );
}

export default Likes;

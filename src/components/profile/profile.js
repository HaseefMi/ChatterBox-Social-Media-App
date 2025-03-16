import './profile.css';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/user-context';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase-utils';
import FooterNav from '../footer-nav/footer-nav';
import AccountPlaceHolder from '../../assets/account-icon.png';

function Profile() {
    const defaultProfileFields = {
        bio: '',
        birthday: '',
        pic: '',
    };

    const { userName, userInfo } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formFields, setFormFields] = useState(defaultProfileFields);
    const [editBio, setEditBio] = useState(false);
    const [editBirthday, setEditBirthday] = useState(false);
    const [editPic, setEditPic] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const fetchData = async () => {
        if (!userInfo || !userInfo['uid']) {
            setError('User ID is not available');
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, 'Users'), where('uid', '==', userInfo['uid']));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log('Fetched user data:', userData);
                setProfile(userData);
                setFormFields({
                    bio: userData.bio || '',
                    birthday: userData.birthday || ''
                });
            } else {
                setError('No user found with the given uid');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowers = async () => {
        try {
            const followersQuery = query(
                collection(db, 'Followers'),
                where('account_followed', '==', userInfo['uid']) 
            );
            const followingQuery = query(
                collection(db, 'Followers'),
                where('follower_id', '==', userInfo['uid']) 
            );

            const followersSnapshot = await getDocs(followersQuery);
            const followingSnapshot = await getDocs(followingQuery);

            setFollowers(followersSnapshot.size); 
            setFollowing(followingSnapshot.size);
        } catch (error) {
            console.error('Error fetching followers:', error);
            setError('Failed to fetch followers');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formFields.bio && !formFields.birthday && !formFields.pic) {
            setError('Both fields cannot be empty');
            return;
        }

        if (!userInfo || !userInfo['uid']) {
            setError('User ID is not available');
            return;
        }

        try {
            const userDocRef = doc(db, 'Users', userInfo['uid']);

            const updateData = {};
            if (formFields.bio) {
                updateData.bio = formFields.bio;
            }
            if (formFields.birthday) {
                updateData.birthday = formFields.birthday;
            }
            if (formFields.pic) {
                updateData.pic = formFields.pic;
            }

            await updateDoc(userDocRef, updateData);
            console.log('Profile updated successfully');

            setProfile(prevProfile => ({
                ...prevProfile,
                bio: formFields.bio || prevProfile.bio,
                birthday: formFields.birthday || prevProfile.birthday,
                pic: formFields.pic || prevProfile.pic,
            }));
            setEditBio(false);
            setEditBirthday(false);

        } catch (error) {
            console.error('Error updating profile:', error);
            setError(`${error.message}`);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo['uid']) {
            setLoading(true);
            fetchData();
            fetchFollowers();
        }
    }, [userInfo]);

    if (loading) {
        return <div>Loading... <FooterNav /></div>;
    }

    if (error) {
        return <div>Error: {error} <FooterNav /></div>;
    }

    return (
        <div className='profile-container'>
            {!profile.pic ? (
                <img src={AccountPlaceHolder} onClick={() => setEditPic(!editPic)} />
            ) : (
                <img src={profile.pic} onClick={() => setEditPic(!editPic)} />
            )}
            {editPic && (
                <>
                    <p>Change Your Profile Picture</p>
                    <form onSubmit={handleSubmit}>
                        <input type='file' name='pic' value={formFields.pic} onChange={handleChange} />
                        <br />
                        <button type='submit'>Save</button>
                    </form>
                </>
            )}
            <h1>{userName}'s Profile</h1>
            <p>Followers: {followers}</p>
            <p>Following: {following}</p>
            {profile ? (
                <>
                    <h2>Name: {profile.name}</h2>
                    <h2>Account Created at {profile.createdAt.toDate().toLocaleString()}</h2>

                    <h3>Bio:</h3>
                    {editBio ? (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className='bio-input'
                                name='bio'
                                value={formFields.bio}
                                onChange={handleChange}
                            />
                            <br />
                            <button type='submit'>Save</button>
                        </form>
                    ) : (
                        <p onClick={() => setEditBio(true)}>{profile.bio || 'Add Your Bio!'}</p>
                    )}

                    <h3>Birthday:</h3>
                    {editBirthday ? (
                        <form onSubmit={handleSubmit}>
                            <input
                                type='date'
                                name='birthday'
                                value={formFields.birthday}
                                onChange={handleChange}
                            />
                            <br />
                            <button type="submit">Save</button>
                        </form>
                    ) : (
                        <p onClick={() => setEditBirthday(true)}>{profile.birthday || 'Add Your Birthday'}</p>
                    )}
                </>
            ) : (
                <p>No profile data available.</p>
            )}
            <FooterNav />
        </div>
    );
}

export default Profile;

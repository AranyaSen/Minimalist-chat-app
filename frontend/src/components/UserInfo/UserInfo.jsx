import React, { useContext } from 'react'
import './UserInfo.css';
import logoutIcon from '../../images/logout.png';
import { userLogInName } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
    // CONTEXT VARIABLES
    const { loginName } = useContext(userLogInName);

    const navigate = useNavigate();

    const handleSignOut = () => {
        document.cookie = 'token=; Path=/;Expires=Thu, 01 Jan 1970 00:00:00 UTC';
        navigate('/signin')
    }

    return (
        <div className='user-info'>
            <div className='greeting-section'>Hi{'\u00A0'}<span className='user-name'>{loginName}</span></div>
            <div className='signout-icon' onClick={handleSignOut}>
                <img src={logoutIcon} alt='logout-icon' title='Sign Out' />
            </div>
        </div>
    )
}

export default UserInfo
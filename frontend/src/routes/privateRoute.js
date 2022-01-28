import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authProvider';

const PrivateRoute = ({ children }) => {
    // CONTEXT
    const { userState } = useAuth()

    // RENDER
    return userState.isLogin ? children : <Navigate to="/" />
};

export default PrivateRoute;
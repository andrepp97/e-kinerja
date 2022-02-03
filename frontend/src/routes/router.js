import React from 'react';
import PrivateRoute from './privateRoute';
import { Routes, Route } from 'react-router-dom';

import {
    Login,
    Dashboard,
    Attendance,
    Assignment,
    PageNotFound,
    UserDetail,
    Users,
} from '../pages';

const Router = () => {
    return (
        <Routes >
            <Route path="/" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/attendance"
                element={
                    <PrivateRoute>
                        <Attendance />
                    </PrivateRoute>
                }
            />
            <Route
                path="/assignments"
                element={
                    <PrivateRoute>
                        <Assignment />
                    </PrivateRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <PrivateRoute>
                        <Users />
                    </PrivateRoute>
                }
            />
            <Route
                path="/user/:id"
                element={
                    <PrivateRoute>
                        <UserDetail />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default Router;
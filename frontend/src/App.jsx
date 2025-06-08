import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./assets/parts/Layout";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Authentication from "./pages/Login";
import About from "./pages/About";
import Trainings from "./pages/Trainings";
import Exercise from './assets/parts/Exercise';
import ExercisesAdmin from "./pages/ExercisesAdmin";
import TrainingCreate from "./pages/TrainingCreate";
import TrainingsList from "./pages/TrainingsList";
import TrainingForUserCreate from "./pages/TrainingForUserCreate";
import ExercisesList from "./pages/ExercisesList";
import { authAPI } from "./api/auth";
import ExercisesSwitcher from "./pages/ExercisesSwitcher";


const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <Layout>
                        <MainPage />
                    </Layout>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Authentication />} />
                <Route path="/about" element={
                    <Layout>
                        <About />
                    </Layout>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/trainings" element={
                    <PrivateRoute>
                        <Layout>
                            <Trainings />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/exercise/:id" element={
                    <PrivateRoute>
                        <Layout>
                            <Exercise />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/exercises" element={
                    <PrivateRoute>
                        <ExercisesSwitcher />
                    </PrivateRoute>
                } />
                <Route path="/trainings/create" element={
                    <PrivateRoute>
                        <TrainingCreate />
                    </PrivateRoute>
                } />
                <Route path="/trainings/my" element={
                    <PrivateRoute>
                        <TrainingsList />
                    </PrivateRoute>
                } />
                <Route path="/coach/training/create" element={
                    <PrivateRoute>
                        <Layout>
                            <TrainingForUserCreate />
                        </Layout>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

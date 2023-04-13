import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register';
import ShowNews from './pages/ShowNews';
import Profile from './pages/Profile';
import NewsSaved from './pages/NewsSaved';

export default function Router() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/saved" element={<NewsSaved />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/news/:id" element={<ShowNews />} />
                <Route path="user/:id" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}

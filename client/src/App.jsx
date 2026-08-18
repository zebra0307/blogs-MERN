import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';

import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import UploadResource from './pages/UploadResource';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import ComingSoon from './pages/ComingSoon';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

import VerifySubscription from './pages/VerifySubscription';
import Unsubscribe from './pages/Unsubscribe';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/resources' element={<Resources />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/coming-soon' element={<ComingSoon />} />
        <Route path='/verify-subscription/:token' element={<VerifySubscription />} />
        <Route path='/unsubscribe/:token' element={<Unsubscribe />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/upload-resource' element={<UploadResource />} />
        </Route>
        
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
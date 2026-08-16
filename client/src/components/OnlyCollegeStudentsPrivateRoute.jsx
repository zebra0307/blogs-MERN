import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { isCollegeStudent } from '../utils/authUtils';

export default function OnlyCollegeStudentsPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return isCollegeStudent(currentUser) ? <Outlet /> : <Navigate to='/' />;
}

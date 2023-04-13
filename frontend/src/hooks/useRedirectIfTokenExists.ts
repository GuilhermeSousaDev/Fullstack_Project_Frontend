import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRedirectIfTokenExists = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
        navigate('/');
    }
  }, []);
}

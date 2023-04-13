import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const useRedirectAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (!jwtToken) {
      navigate('/login');
    } else {
      (async () => {
        const { data } = await api.post('verify-token', { token: jwtToken });

        if (!data) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      })();
    }
  }, []);
}

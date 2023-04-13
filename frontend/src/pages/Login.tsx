import { useState, ChangeEvent } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useRedirectAuth } from '../hooks/useRedirectAuth';
import { SnackbarResponse } from '../components/Snackbar';
import { AlertColor } from '@mui/material/Alert';
import { useRedirectIfTokenExists } from '../hooks/useRedirectIfTokenExists';

interface IForm {
  [key: string]: any;
}

interface ISnackbar {
  isActive: boolean;
  type: AlertColor;
  message: string;
}

const initialSnackbarState = {
  isActive: false,
  type: 'success',
  message: '',
} as ISnackbar;

export default function Login() {
  useRedirectIfTokenExists();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<ISnackbar>(initialSnackbarState);
  const [form, setForm] = useState<IForm>({
    email: '',
    password: '',
  });

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSign = async () => {
    if (form.email && form.password) {
      const formData = new FormData();

      formData.append('email', form.email);
      formData.append('password', form.password);

      try {
        const { data } = await api.post('/session', formData, {
          'headers': {
            'Content-Type': 'application/json',
          },
        });

        localStorage.setItem('token', data.token);

        setSnackbar({
          type: 'success',
          isActive: true,
          message: `Welcome ${data.user.name}`,
        });

        setTimeout(() => navigate('/'), 2000);
      } catch (error: any) {
        setSnackbar({
          type: 'error',
          isActive: true,
          message: error.response.data.message,
        });
      }
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 540
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{ border: '2px solid #313fa5', borderRadius: 10, padding: 10, background: '#b3e2f7' }}
      >

        <SnackbarResponse
            open={snackbar.isActive}
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar({ ...snackbar, isActive: false })}
        />
        <FormControl sx={{ mb: 5 }}>
          <InputLabel>Email</InputLabel>
          <Input
            name="email"
            onChange={handleChangeForm}
            startAdornment={
              <InputAdornment position='start'>
                <EmailIcon sx={{ m: 1, mr: 1 }} />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
          <InputLabel>Password</InputLabel>
          <Input
            name="password"
            type={showPassword ? 'text': 'password'}
            onChange={handleChangeForm}
            startAdornment={
              <InputAdornment position='start'>
                <PasswordIcon sx={{ m: 1, mr: 1 }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword ? true : false)}>
                  { showPassword ? <VisibilityIcon /> : <VisibilityOffIcon /> }
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={snackbar.isActive}
            onClick={handleSign}
          >
            Sign
          </Button>
          <Button
            sx={{ ml: 3 }}
            variant="contained"
            color="secondary"
            disabled={snackbar.isActive}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

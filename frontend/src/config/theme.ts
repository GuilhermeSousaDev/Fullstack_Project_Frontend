import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';

export const theme: ThemeOptions = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a2284',
    },
    secondary: {
      main: '#0f528b',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
      contrastText: '#fff',
    },
    warning: {
      main: '#ed6c02',
      dark: '#e65100',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      dark: '#01579b',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
      dark: '#1b5e20',
      contrastText: '#fff',
    }
  },
});

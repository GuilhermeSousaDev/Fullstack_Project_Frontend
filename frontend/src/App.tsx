import { ThemeProvider } from '@mui/material';
import Router from './routes';
import { theme } from './config/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}

export default App;

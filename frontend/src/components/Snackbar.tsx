import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface IProps {
  open: boolean;
  type: AlertColor;
  message: string;
  onClose: () => void;
}

export function SnackbarResponse({ open, type, message, onClose }: IProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert severity={type}>{ message }</Alert>
    </Snackbar>
  )
}

import React, { ChangeEvent, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DragFileModal from './DragFileModal';

export interface IForm {
  [key: string]: any;
}

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

export default function CreatePostModal({ open, setOpen }: IProps) {
    const [form, setForm] = useState<IForm>({
      title: '',
      description: '',
      content: ''
    });
    const [isActive, setIsActive] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
      setIsActive(true);
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const handleClose = () => {
      setOpen(false);
      setIsComplete(false);
      setIsActive(false);
    };

    const msg = "Empty Field";
    const disabledButton = !form.title || !form.content || !form.description;

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            { !isComplete ?
              (
                <>
                  <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-around"
                      alignItems="center"
                  >
                    <TextField
                      placeholder="Title"
                      variant="outlined"
                      name="title"
                      error={!form.title && isActive}
                      helperText={!form.title && isActive ? msg : ''}
                      onChange={handleChangeForm}
                      multiline
                    />
                    <TextField
                      placeholder="Description"
                      variant="outlined"
                      name="description"
                      error={!form.description && isActive}
                      helperText={!form.description && isActive ? msg : ''}
                      onChange={handleChangeForm}
                      multiline
                      sx={{ mt: 5 }}
                    />
                    <TextField
                      placeholder="Content"
                      variant="outlined"
                      name="content"
                      error={!form.content && isActive}
                      helperText={!form.content && isActive ? msg : ''}
                      onChange={handleChangeForm}
                      multiline
                      sx={{ mt: 5 }}
                    />
                    <Button
                      variant="contained"
                      sx={{ mt: 3 }}
                      onClick={() => setIsComplete(true)}
                      disabled={disabledButton}
                    >
                      Add Post
                    </Button>
                  </Box>
                </>
              )
              : <DragFileModal
                  form={form}
                  setForm={setForm}
                  handleClose={handleClose}
                />
            }
          </Box>
        </Modal>
      </div>
    )
}

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CreatePostModal from '../components/Modal/CreatePostModal';
import { useRedirectAuth } from '../hooks/useRedirectAuth';

export default function Home() {
    useRedirectAuth();

    const [open, setOpen] = useState(false);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: 540 }}
        >
            <Button
                variant="contained"
                onClick={() => setOpen(open ? false : true)}
                startIcon={<AddIcon />}
            >
                Create Post
            </Button>

            <CreatePostModal open={open} setOpen={setOpen} />
        </Box>
    )
}

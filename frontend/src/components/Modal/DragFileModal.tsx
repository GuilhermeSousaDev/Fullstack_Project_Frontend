import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import { useTheme } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { IForm } from "./CreatePostModal";
import { SnackbarResponse } from '../Snackbar';
import { AlertColor } from "@mui/material/Alert";

interface IProps {
  form: IForm;
  setForm: React.Dispatch<React.SetStateAction<IForm>>;
  handleClose: () => void;
}

interface INews {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IJwtToken {
  id: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
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

export default function DragFileModal({ form, setForm, handleClose }: IProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("token");

  const [file, setFile] = useState<(File & { preview: string }) | null>(null);
  const [color, setColor] = useState(theme.palette.primary.light);
  const [msg, setMsg] = useState("Drag Files Here...");
  const [isDisabled, setIsDisabled] = useState(false);
  const [snackbar, setSnackbar] = useState<ISnackbar>(initialSnackbarState);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (screen.width < 640 || screen.height < 480) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [screen.width, screen.height]);

  const { getRootProps } = useDropzone({
    onDragEnter: () => {
      setColor(theme.palette.success.light);
      setMsg("Drop Files Here...");
    },
    onDragLeave: () => {
      setColor(theme.palette.primary.light);
      setMsg("Drag Files Here...");
    },
    onDropAccepted: () => {
      setColor(theme.palette.success.dark);
      setMsg("Success Update! Send Files");
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
    },
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });

  const handleCancelCreatePost = () => {
    setFile(null);
    setForm({
      title: "",
      description: "",
      content: "",
    });
    handleClose();
  };

  const handleCreateNewPost = async () => {
    if (file && form && jwtToken) {
      const user = jwt_decode<IJwtToken>(jwtToken);

      if (user) {
        try {
          setIsDisabled(true);
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", form.title);
          formData.append("description", form.description);
          formData.append("content", form.content);
          formData.append("user", user.id.toString());
          formData.append("username", user.name);

          await api.post<INews>("/news", formData, {
            headers: {
              Authorization: jwtToken,
            },
          });

          setSnackbar({
            isActive: true,
            type: 'success',
            message: `News created with success`,
          });

          setTimeout(() => navigate('/news'), 2000);
        } catch (error: any) {
          setSnackbar({
            isActive: true,
            type: 'error',
            message: error.response.data.message,
          });
          setIsDisabled(false);
        }
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: 380 }}
    >
      <SnackbarResponse
        open={snackbar.isActive}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(initialSnackbarState)}
      />
      <Card sx={{ width: 300, height: 300 }}>
        {file?.preview ? (
          <>
            <CardMedia
              {...getRootProps()}
              sx={{ height: 130, cursor: 'pointer' }}
              image={file.preview}
            />
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            sx={{
              height: 100,
              padding: 3,
              boxShadow: "-10px -10px 2px black",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              background: color,
              cursor: 'pointer',
            }}
            { ...getRootProps() }
          >
            <UploadIcon />
            <Typography>{msg}</Typography>
            { isMobile ? <input type="file" onChange={({ target }) => target.files && setFile(Object.assign(target.files[0], { preview: URL.createObjectURL(target.files[0]) }))} /> : '' }
          </Box>
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {form.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {form.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelCreatePost}
            disabled={isDisabled}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!file || isDisabled}
            onClick={handleCreateNewPost}
          >
            Create News
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

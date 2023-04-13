import { useState } from 'react';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AlertColor } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useCallback } from "react";
import { SnackbarResponse } from "./Snackbar";

interface User {
  id: number;
  name: string;
  email: string;
  news: INews[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface INews {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  user: User;
  createdAt: Date;
}

interface IProps {
  news: INews;
  isOwnNews: boolean;
}

interface ISnackbarConfig {
  open: boolean;
  message: string;
  type: AlertColor,
}

const DEFAULT = {
  image: "https://www.cieq.org.br/uploads/noticias/noImage.jpg",
};

export default function CardNews({ news, isOwnNews }: IProps) {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("token");

  const [snackbarConfig, setSnackbarConfig] = useState<ISnackbarConfig>({
    open: false,
    message: '',
    type: 'success',
  });

  const handleViewNews = () => {
    navigate(`/news/${news.id}`);
  };

  const handleViewUserProfile = useCallback(() => {
    if (news.user) {
      navigate(`/user/${news.user.id}`);
    }
  }, []);

  const handleDeleteNews = async (id: number) => {    
    try {
      await api.delete(`news/${news.id}`, {
        headers: {
          Authorization: jwtToken,
        },
      });

      setSnackbarConfig({
        open: true,
        message: 'News Deleted With Success',
        type: 'success',
      });
    } catch (e) {
      setSnackbarConfig({
        open: true,
        message: 'Error for Delete News',
        type: 'error',
      });
    }
  }

  return (
    <Card sx={{ width: 400, mt: 5 }}>
      <SnackbarResponse 
        open={snackbarConfig.open}
        message={snackbarConfig.message}
        type={snackbarConfig.type}
        onClose={() => setSnackbarConfig({ ...snackbarConfig, open: false })}
      />
      {news.user && (
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500], cursor: "pointer" }}
              onClick={handleViewUserProfile}
            >
              {news.user.name[0]}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={news.user.name}
          subheader={new Date(news.createdAt).toLocaleString()}
        />
      )}
      <CardMedia
        sx={{ height: 170 }}
        image={news.image ? news.image : DEFAULT.image}
        title={news.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {news.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={handleViewNews}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

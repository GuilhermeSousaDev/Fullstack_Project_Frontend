import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { red } from "@mui/material/colors";
import { useRedirectAuth } from "../hooks/useRedirectAuth";
import { SnackbarResponse } from "../components/Snackbar";
import { AlertColor } from "@mui/material/Alert";

interface IUser {
  id: number;
  name: string;
  email: string;
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
  likes: ILike[];
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

interface ILike {
  id: number;
  news: INews;
  user: IUser;
}

interface IFavorites extends ILike {}

interface IDefault {
  image: string;
  snackbarState: {
    isActive: boolean;
    message: string;
    type: AlertColor;
  };
}

const DEFAULT = {
  image: "https://www.cieq.org.br/uploads/noticias/noImage.jpg",
  snackbarState: {
    isActive: false,
    message: '',
    type: 'success',
  }
} as IDefault;

export default function ShowNews() {
  useRedirectAuth();

  const { id } = useParams();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("token");

  const [news, setNews] = useState<INews | null>(null);
  const [like, setLike] = useState<ILike | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [favorite, setFavorite] = useState<IFavorites | null>(null);
  const [snackbarConfig, setSnackbarConfig] = useState(DEFAULT.snackbarState);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      if (id && jwtToken) {
        const { data } = await api.get<INews>(`/news/${id}`);

        const user = jwt_decode<IUser>(jwtToken);
        setUser(user);
        const like = data.likes
          .filter((like) => like.user.id === user.id)[0];

        if (like) {
          setIsLiked(true);
          setLike(like);
        }

        setNews(data);

        if (news) {
          const favorites = await api.get<IFavorites[]>(`favorites/news`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: jwtToken,
            },
          });

          const userSavedThisNews = favorites.data
            .filter((favorites) => favorites.news.id === news.id)[0];

          if (userSavedThisNews) {
            setIsSaved(true);
            setFavorite(userSavedThisNews);
          }
        }
      }
    })();
  }, [id, isLiked, isSaved]);

  const handleViewProfileUser = useCallback(() => {
    if (news) {
      navigate(`/user/${news.user.id}`);
    }
  }, []);

  const handleLikeNews = async () => {
    try {
      if (!isLiked && user && news) {
      const formData = new FormData();
      formData.append("user", user.id.toString());
      formData.append("news", news.id.toString());

      await api.post("/news/like", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jwtToken,
        },
      });

      setSnackbarConfig({
        isActive: true,
        message: 'Like a News',
        type: 'success',
      });
    } else {
      if (like) {
        await api.delete(`/news/like/${like.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: jwtToken,
          },
        });
        setSnackbarConfig({
          isActive: true,
          message: 'Retired Like',
          type: 'success',
        });
      }
    }

      setIsLiked((prev) => (!prev ? true : false));
    } catch (error: any) {
      setSnackbarConfig({
        isActive: true,
        message: error.response.data.message,
        type: 'error',
      });
      setIsLiked(false);
    }
  };

  const handleSaveNews = async () => {
    try {
      if (!isSaved && user && news) {
        const formData = new FormData();
  
        formData.append("user", user.id.toString());
        formData.append("news", news.id.toString());
  
        await api.post("favorites/news", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: jwtToken,
          },
        });
        setSnackbarConfig({
          isActive: true,
          message: 'News Saved',
          type: 'success',
        });
        
      } else {
        if (favorite) {
          await api.delete(`favorites/news/${favorite.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: jwtToken,
            },
          });
          setSnackbarConfig({
            isActive: true,
            message: 'Retired Save',
            type: 'success',
          });
        }
      }
  
      setIsSaved((prev) => (!prev ? true : false));
    } catch (error: any) {
      setSnackbarConfig({
        isActive: true,
        message: error.response.data.message,
        type: 'error',
      });
      setIsSaved(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: 540 }}
    >
      <SnackbarResponse 
        open={snackbarConfig.isActive}
        message={snackbarConfig.message}
        type={snackbarConfig.type}
        onClose={() => setSnackbarConfig(DEFAULT.snackbarState)} 
      />
      {news ? (
        <Card sx={{ width: 400, mt: 5 }}>
          <CardHeader
            avatar={
              <IconButton onClick={handleViewProfileUser}>
                <Avatar sx={{ bgcolor: red[500] }}>{news.user.name[0]}</Avatar>
              </IconButton>
            }
            title={news.title}
            subheader={new Date(news.createdAt).toLocaleString()}
          />
          <CardMedia
            sx={{ height: 170 }}
            image={
              news.image
                ? news.image
                : DEFAULT.image
            }
            title={news.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {news.content}
            </Typography>
          </CardContent>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant={isSaved ? "contained" : "outlined"}
              onClick={handleSaveNews}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
            <IconButton onClick={handleLikeNews}>
              {isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
              {news.likes.length}
            </IconButton>
          </CardActions>
        </Card>
      ) : (
        "News not Found"
      )}
    </Box>
  );
}

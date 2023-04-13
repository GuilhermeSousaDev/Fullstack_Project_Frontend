import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Box from "@mui/material/Box";
import { api } from "../services/api";
import { useRedirectAuth } from "../hooks/useRedirectAuth";
import CardNews from "../components/CardNews";
import Typography from "@mui/material/Typography";

interface IUser {
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
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

interface IFavorites {
  id: number;
  news: INews;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export default function NewsSaved() {
  useRedirectAuth();

  const jwtToken = localStorage.getItem("token");

  const [newsSaved, setNewsSaved] = useState<IFavorites[] | null>(null);

  useEffect(() => {
    (async () => {
      if (jwtToken) {
        const { data } = await api.get<IFavorites[]>("favorites/news", {
          headers: {
            Authorization: jwtToken,
          },
        });

        setNewsSaved(data);
      }
    })();
  }, [jwtToken]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: 540 }}
    >
      <Typography fontSize={20} color="primary">
        Your Saved News
      </Typography>
      {newsSaved
        ? newsSaved.map(({ news }) => (
            <CardNews key={news.id} news={news} isOwnNews={false} />
          ))
        : "...Loading"}
    </Box>
  );
}

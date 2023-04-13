import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Box from "@mui/material/Box";
import CardNews from "../components/CardNews";

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
  updatedAt: Date;
}

export default function News() {
  const [news, setNews] = useState<INews[]>([]);

  useEffect(() => {
    (async () => {
        const { data } = await api.get<INews[]>('/news');
        setNews(data);
    })();
  }, []);
  return (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        flexWrap="wrap"
        sx={{ height: 540 }}
    >
      <>
        { news.length ?
          news.map((newsData) => (
            <CardNews 
              key={newsData.id} 
              news={newsData} 
              isOwnNews={false} 
            />
          ))
         : '...Loading'
        }
      </>
    </Box>
  );
}

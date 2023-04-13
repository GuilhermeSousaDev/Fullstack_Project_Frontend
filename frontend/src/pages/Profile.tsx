import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { api } from "../services/api";
import { useRedirectAuth } from "../hooks/useRedirectAuth";
import { useParams } from "react-router-dom";
import CardNews from "../components/CardNews";

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

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  news: INews[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Profile() {
  useRedirectAuth();

  const jwtToken = localStorage.getItem("token");
  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (jwtToken) {
      (async () => {
        const user = jwt_decode<IUser>(jwtToken);
        setLoggedUserId(user.id.toString());

        const { data } = await api.get(`/user/${id}`, {
          headers: {
            Authorization: jwtToken,
          },
        });

        setUser(data);
      })();
    }
  }, [id]);

  const handleDisconnect = () => {
    localStorage.removeItem('token');
    location.reload();
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography
        fontSize={25}
        sx={{
          mb: 5,
          bgcolor: "#0f528b",
          padding: 2,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          width: "90%",
          textAlign: "center",
        }}
      >
        <AccountCircleIcon fontSize="large" sx={{ mr: 0.5 }} />
        {id === loggedUserId ? "Your Profile" : `"${user?.name}" Profile`} <br />
        { id === loggedUserId && 
          <Button variant="contained" color="error" onClick={handleDisconnect}>Disconnect</Button> 
        }
      </Typography>

      <Typography fontSize={20} color="primary">
        Name
      </Typography>
      <Typography fontSize={15}>{user?.name}</Typography>

      <Typography fontSize={20} color="primary">
        Email
      </Typography>
      <Typography fontSize={15}>{user?.email}</Typography>

      <Typography fontSize={20} color="primary">
        Account Created
      </Typography>
      <Typography fontSize={15}>
        {user?.createdAt
          ? new Date(user?.createdAt).toLocaleDateString()
          : null}
      </Typography>

      <Divider />
      <Typography color="primary" fontSize={25} sx={{ mt: 5 }}>
        {id === user?.id.toString() ? "Your News" : `${user?.name} News`}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        flexWrap="wrap"
      >
        <>
          {user?.news
            ? user.news.map((news) => (
                <CardNews key={news.id} news={news} isOwnNews={id === user.id.toString()} />
              ))
            : "No Results"}
        </>
      </Box>
    </Box>
  );
}

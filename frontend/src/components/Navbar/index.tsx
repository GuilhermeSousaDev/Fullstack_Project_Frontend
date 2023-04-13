import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NewsIcon from "@mui/icons-material/Newspaper";
import LikeIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import DrawerBar from "./Drawer";
import { api } from "../../services/api";

interface INotification {
  notification: {
    id: number;
    type: string;
    message: string;
    linkId: number;
  }[];
  notificationsLength: number;
}

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Navbar() {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('token');

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<INotification | null>(
    null
  );
  const [notificationsLengthState, setNotificationsLengthState] = useState(0);
  const [isViewedNotifications, setIsViewedNotifications] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [open, setOpen] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  useEffect(() => {
    (async () => {
      if (jwtToken) {
        setUser(jwt_decode(jwtToken));
        const { data } = await api.get<INotification>("/notification", {
          headers: {
            Authorization: jwtToken,
          },
        });

        const localStorageNotificationsLength = Number(
          localStorage.getItem("notifications")
        );
        if (!localStorageNotificationsLength) {
          localStorage.setItem(
            "notifications",
            data.notificationsLength.toString()
          );
          setNotificationsLengthState(data.notificationsLength);
        } else {
          setIsViewedNotifications(true);
          if (data.notificationsLength > localStorageNotificationsLength) {
            setIsViewedNotifications(false);
            const newNotificationsLength =
              data.notificationsLength - localStorageNotificationsLength;
            setNotificationsLengthState(newNotificationsLength);
            localStorage.setItem(
              "notifications",
              newNotificationsLength.toString()
            );
          }
        }

        setNotifications(data);
      }
    })();
  }, [jwtToken]);

  const handleProfileOpen = () => {
    navigate(`/user/${user?.id}`);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    setIsViewedNotifications(true);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationNavigate = (id: number, type: string) => {
    if (type === "news") {
      navigate(`/news/${id}`);
    }
    if (type === "friend") {
      navigate(`profile/${id}`);
    }
    if (type === "like") {
      navigate(`/news/${id}`);
    }
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationMenuOpen}>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={isViewedNotifications ? 0 : notificationsLengthState}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <Link to={`user/${user?.id}`}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Link>
    </Menu>
  );

  const notificationMenuId = "primary-search-account-menu-notification";
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={notificationMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
      sx={{ width: 300, height: 300, padding: 5 }}
    >
      <Typography sx={{ padding: 5 }}>Notifications</Typography>
      {notifications?.notification ? 
        notifications.notification.map((notificate) => (
            <MenuItem
              onClick={() =>
                handleNotificationNavigate(notificate.linkId, notificate.type)
              }
            >
              {notificate.message}
              <IconButton>
                {notificate.type == "friend" && <AccountCircle />}
                {notificate.type == "news" && <NewsIcon />}
                {notificate.type == "like" && <LikeIcon />}
              </IconButton>
            </MenuItem>
          ))
        : ""}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={() => setOpen(open == false ? true : false)} />
          </IconButton>
          <DrawerBar open={open} setOpen={setOpen} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            NEWS
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              {jwtToken && (
                <Badge
                  badgeContent={
                    isViewedNotifications ? 0 : notificationsLengthState
                  }
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              )}
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderNotificationMenu}
    </Box>
  );
}

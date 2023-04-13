import React from 'react';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import ListItemIcon from "@mui/material/ListItemIcon";
import NewsPaperIcon from "@mui/icons-material/Newspaper";
import NewsSavedIcon from "@mui/icons-material/BookmarkAddedTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import Link from '@mui/material/Link';

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DrawerBar({ open, setOpen }: IProps) {

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <Link href="/" onClick={() => setOpen(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/news" onClick={() => setOpen(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <NewsPaperIcon />
                </ListItemIcon>
                <ListItemText primary={"News"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/news/saved" onClick={() => setOpen(false)}>
              <ListItemButton>
                <ListItemIcon>
                  <NewsSavedIcon />
                </ListItemIcon>
                <ListItemText primary={"Saved News"} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import DarkModeToggle from "../DarkModeToggle";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const navigate = useNavigate();
  const isLoggedIn = Boolean(
    localStorage.getItem("accessToken") && localStorage.getItem("user_id")
  );

  return (
    <Box className="z-50">
      <header className={classes.header}>
        <Group py={2} justify="space-between" h="100%">
          <h3>Mad-Medium</h3>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/blogs" className={classes.link}>
              Blogs
            </a>

            <a href="/create-blog" className={classes.link}>
              Write a Blog
            </a>
          </Group>

          <Group visibleFrom="sm">
            <DarkModeToggle />
            {!isLoggedIn ? (
              <>
                <Button variant="default" onClick={() => navigate("/signin")}>
                  Sign in
                </Button>

                <Button onClick={() => navigate("/signup")}>Sign up</Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  navigate("/signin");
                }}
              >
                Sign out
              </Button>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="/blogs" className={classes.link}>
              Blogs
            </a>

            <a href="/create-blog" className={classes.link}>
              Write a Blog
            </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
          {!isLoggedIn ? (
              <>
                <Button variant="default" onClick={() => navigate("/signin")}>
                  Sign in
                </Button>

                <Button onClick={() => navigate("/signup")}>Sign up</Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  navigate("/signin");
                }}
              >
                Sign out
              </Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

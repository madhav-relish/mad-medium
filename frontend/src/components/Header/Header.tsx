import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  AppShell,
  Menu,
  Text,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  IconChevronDown,
  IconLogout,
  IconNotebook,
} from "@tabler/icons-react";
import { useState } from "react";
import cx from "clsx";
import classes from "./Header.module.css";
import DarkModeToggle from "../DarkModeToggle";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = Boolean(
    localStorage.getItem("accessToken") && localStorage.getItem("user_id")
  );

  const userName = localStorage.getItem("username");

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
  };

  return (
    <AppShell>
      <AppShell.Header
        py={2}
        classNames={{
          header: "opacity-95 backdrop-blur-3xl border-b",
        }}
      >
        <Box className="backdrop-blur-3xl">
          <header className={`${classes.header}`}>
            <Group py={2} justify="space-between" h="100%">
              <h3 className="cursor-pointer" onClick={() => navigate("/")}>
                Mad-Medium
              </h3>

              {isLoggedIn && (
                <Group h="100%" gap={0} visibleFrom="sm">
                  <a href="/blogs" className={classes.link}>
                    Blogs
                  </a>

                  <a href="/create-blog" className={classes.link}>
                    Write a Blog
                  </a>
                </Group>
              )}

              <Group visibleFrom="sm">
                <DarkModeToggle />
                {!isLoggedIn ? (
                  <>
                    <Button
                      variant="default"
                      onClick={() => navigate("/signin")}
                    >
                      Sign in
                    </Button>
                    <Button onClick={() => navigate("/signup")}>Sign up</Button>
                  </>
                ) : (
                  <Menu
                    position="bottom-end"
                    transitionProps={{ transition: "pop-top-right" }}
                    onClose={() => setUserMenuOpened(false)}
                    onOpen={() => setUserMenuOpened(true)}
                    withinPortal
                  >
                    <Menu.Target>
                      <Button
                        variant="transparent"
                        className={cx(classes.user, {
                          [classes.userActive]: userMenuOpened,
                        })}
                      >
                        <Group gap={7}>
                          <Avatar
                            src={"D"}
                            alt={"Demo"}
                            radius="xl"
                            size={40}
                          />
                          <Text fw={500} size="sm" lh={1} mr={3}>
                            {userName}
                          </Text>
                          <IconChevronDown
                            style={{ width: rem(12), height: rem(12) }}
                            stroke={1.5}
                          />
                        </Group>
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconNotebook color="orange" />}
                        onClick={() => navigate("/manage-blogs")}
                      >
                        Manage Blogs
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconLogout color={"red"} stroke={1.5} />}
                        onClick={handleSignOut}
                      >
                        Sign out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
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

              {isLoggedIn && (
                <>
                  <a href="/blogs" className={classes.link}>
                    Blogs
                  </a>

                  <a href="/create-blog" className={classes.link}>
                    Write a Blog
                  </a>
                  <a
                    href="/manage-blogs"
                    className={classes.link}
                    onClick={closeDrawer}
                  >
                    Manage Blogs
                  </a>
                  <Divider my="sm" />
                </>
              )}

              <Group justify="center" grow pb="xl" px="md">
                {!isLoggedIn ? (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        navigate("/signin");
                        closeDrawer();
                      }}
                    >
                      Sign in
                    </Button>

                    <Button
                      onClick={() => {
                        navigate("/signup");
                        closeDrawer();
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      handleSignOut();
                      closeDrawer();
                    }}
                  >
                    Sign out
                  </Button>
                )}
              </Group>
            </ScrollArea>
          </Drawer>
        </Box>
      </AppShell.Header>
    </AppShell>
  );
}

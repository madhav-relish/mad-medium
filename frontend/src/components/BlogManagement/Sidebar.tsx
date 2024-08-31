import { AppShell, Burger, Group, ScrollArea, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import Blog from "../../pages/Blog";
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

interface Blog {
  id: string;
  title: string;
  content?: string;
  published?: boolean;
  // Add other fields if necessary
}

export function Sidebar() {
  const [opened, { toggle }] = useDisclosure();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBlogId, setCurrentBlogId] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async () => {
      const authorId = localStorage.getItem("user_id");

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/blog/all-of-author?authorId=${authorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setBlogs(data);
        setCurrentBlogId(data[0].id);
      } catch (error) {
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleTitleClick = (id: string) => {
    setCurrentBlogId(id);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea}>
          {loading ? (
            Array(15)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} h={28} mt="sm" animate={false} />
              ))
          ) : (
            <>
              {blogs?.map((blog) => (
                <div
                  onClick={() => handleTitleClick(blog.id)}
                  key={blog.id}
                  className={`my-2 cursor-pointer p-4 rounded-xl ${
                    currentBlogId === blog.id ? "bg-gray-800 text-white" : ""
                  } hover:bg-gray-800 hover:text-white`}
                >
                  {blog.title}
                </div>
              ))}
            </>
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main pt={8}>
        {" "}
       {!opened && <div  onClick={toggle} className="md:hidden" >
            <IconLayoutSidebarLeftExpand size={30}/>
        </div> }
        <Blog blogId={currentBlogId} />
      </AppShell.Main>
    </AppShell>
  );
}

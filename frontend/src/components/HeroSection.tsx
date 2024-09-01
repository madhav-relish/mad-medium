import { Button } from "@mantine/core";
import { IconMedal, IconTopologyStar } from "@tabler/icons-react";
import FeatureImageCard from "./FeatureImageCard";
import FeatureCard from "./FeatureCard";
import github_img from "../assets/madmedium_github.png";
import richtexteditor_img from "../assets/rte3.png";
import richTextEditorLight from "../assets/rtelight.png";
import blog_img from "../assets/blog.png";
import blogsPage_img from "../assets/reader-friendly.png";
import mangeBlogs_img from "../assets/manageBlogs.png";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <div className="w-fit flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white bg-blue-100 text-blue-700 font-semibold">
        <IconMedal size={30} />
        Best Blogging Platform
      </div>
      <div className="max-w-[600px] text-center">
        <h2 className="text-5xl mt-10 flex flex-col items-center">
          Your Go-To blog writing platform
        </h2>
        <p className="text-xl text-gray-400 mt-10">
          {" "}
          A powerful, open-source platform where writers can manage their blogs,
          and readers can enjoy great content.
        </p>
      </div>
      <div>
        <a href="/blogs">
          <Button variant="filled" radius={"xl"} size="lg" py={2} mt={10}>
            Get Started <IconTopologyStar className="ml-2" />
          </Button>
        </a>
      </div>
      <div className="mt-10">
        <FeatureImageCard img_url={blog_img} />
      </div>

      <div className="mt-20 md:mt-40 md:space-y-8 flex flex-col gap-10 md:gap-40">
        <FeatureCard
          img_url={richtexteditor_img}
          title="Rich Text Editor"
          description="Create beautiful, formatted blogs with our easy-to-use editor."
          mirror={true}
        />

        <FeatureCard
          img_url={blogsPage_img}
          title="Reader-Friendly"
          description="Explore a wide range of blogs written by talented authors."
        />
        <FeatureCard
          img_url={mangeBlogs_img}
          title="Blog Management"
          mirror
          description="Keep all your blogs organized in one place, with easy management tools."
          // Image will be on the right side
        />
        <FeatureCard
          title="Dark Mode"
          description="Switch to dark mode for a comfortable reading and writing experience."
          firstImage={richTextEditorLight}
          secondImage={richtexteditor_img}
          compare
          // Image will be on the right side
        />

        <FeatureCard
          img_url={github_img}
          title="Open Source"
          mirror={true}
          description="Contribute to our platform and help it grow, it's all open source!"
        />
      </div>
    </div>
  );
};

export default HeroSection;

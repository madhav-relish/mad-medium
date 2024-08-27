import { testimonials } from "../../utils/constants";
import { InfiniteMovingCards } from "../ui/infinite-moving-card";

const AuthBackground = ({ children }: any) => {
  return (
    <div className=" h-screen w-screen overflow-x-hidden dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        <div className=" left-0 top-10 z-20 flex flex-col">
          <InfiniteMovingCards
            className=""
            speed="superSlow"
            pauseOnHover={false}
            items={testimonials}
          />
          <InfiniteMovingCards
            className="!z-10"
            speed="superSlow"
            direction="right"
            pauseOnHover={false}
            items={testimonials}
          />
        </div>
        {children}
      </p>
    </div>
  );
};

export default AuthBackground;

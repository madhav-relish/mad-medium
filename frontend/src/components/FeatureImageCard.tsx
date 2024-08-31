import { Compare } from "./ui/compare";

const FeatureImageCard = ({
  img_url,
  compare,
  firstImage,
  secondImage,
}: {
  img_url?: string;
  compare?: boolean;
  firstImage?: string;
  secondImage?: string;
}) => {
  return (
    <div className="mx-2 rounded-xl border bg-gradient-to-t from-slate-300 to-slate-400 p-3 shadow-xl dark:from-slate-700 dark:to-slate-600 md:rounded-2xl md:p-6">
      <div
        className="transition duration-200 ease-linear mt-4 w-full"
        style={{
          transform:
            "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
        }}
      >
        {compare ? (
            <div className="w-full h-full">
          <Compare autoplay firstImage={firstImage} secondImage={secondImage} />
        </div>
        ) : (
          <img
            alt="platform"
            loading="lazy"
            width="1080"
            height="1920"
            decoding="async"
            className="rounded-lg border-2 border-slate-600 w-[60vw] md:rounded-xl"
            style={{ color: "transparent" }}
            src={img_url}
          />
        )}
      </div>
    </div>
  );
};

export default FeatureImageCard;

import FeatureImageCard from "./FeatureImageCard";

const FeatureCard = ({
  img_url,
  title,
  description,
  mirror = false,
  compare,
  firstImage,
  secondImage,
}: {
  img_url: string;
  title: string;
  description: string;
  mirror?: boolean;
  compare?: boolean;
  firstImage?: string;
  secondImage?: string;
}) => {
  return (
    <div
      className={` flex flex-col md:flex-row ${
        mirror ? "md:flex-row-reverse" : ""
      } items-center `}
    >
      <div className={`relative ${mirror ? "-right-96" : "-left-96"}`}>
        <FeatureImageCard img_url={img_url} compare={compare} firstImage={firstImage} secondImage={secondImage}/>
      </div>
      <div className="mt-4 md:mt-0 md:ml-6 md:mr-6 flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;

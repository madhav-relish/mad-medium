type MyComponentProps = React.PropsWithChildren<{}>;

const AuthCardBody = ({ children }: MyComponentProps) => {
  return (
    <div className="w-[80vw]  sm:max-w-md z-50  md:min-w-96 md:w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input border-2 bg-white dark:bg-black">
      {children}
    </div>
  );
};

export default AuthCardBody;

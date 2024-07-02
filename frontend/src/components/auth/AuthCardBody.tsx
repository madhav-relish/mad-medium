type MyComponentProps = React.PropsWithChildren<{}>;

const AuthCardBody = ({ children }: MyComponentProps) => {
  return (
    <div className="max-w-md z-50 w-full min-w-96 mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border-2 bg-white dark:bg-black">
      {children}
    </div>
  );
};

export default AuthCardBody;

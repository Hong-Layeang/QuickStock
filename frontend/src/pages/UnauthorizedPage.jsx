const UnauthorizedPage = () => {
  return (
    <div className="text-center mt-20 text-red-700 text-2xl font-bold">
      🔒 Access Denied
      <p className="text-base font-normal text-black mt-4">
        You must log in to view this page.
      </p>
    </div>
  );
};

export default UnauthorizedPage;

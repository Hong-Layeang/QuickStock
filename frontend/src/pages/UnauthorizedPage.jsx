import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const UnauthorizedPage = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("msg");

    if (msg === "expired") {
      setMessage("Your session has expired. Please log in again.");
    } else {
      setMessage("You must log in to view this page.");
    }
  }, [location.search]);

  return (
    <div className="text-center mt-20 text-red-700 text-2xl font-bold">
      🔒 Access Denied
      <p className="text-base font-normal text-black mt-4">{message}</p>
    </div>
  );
};

export default UnauthorizedPage;

import React, { useEffect } from "react";
import { useAuth } from "../../AuthContext";

const ApplicationForm6 = () => {
  const { setIsSaveClicked } = useAuth();
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  return (
    <div>
      <div>applkiation form 6</div>
    </div>
  );
};

export default ApplicationForm6;

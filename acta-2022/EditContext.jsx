import React, { createContext, useContext, useState, useCallback } from "react";

const EditContext = createContext();

export const EditProvider = ({ children }) => {
  const [editStatus, setEditStatus] = useState(false);

  const handleEditStatus = useCallback((value) => {
    setEditStatus(value);
    localStorage.setItem("editStatus", String(value));
  }, []);

  const value = {
    editStatus,
    handleEditStatus,
    setEditStatus,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEdit must be used within an EditProvider");
  }
  return context;
};

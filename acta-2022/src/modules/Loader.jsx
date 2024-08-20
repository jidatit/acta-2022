const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen loading-spinner">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 rounded-full border-t-transparent border-gray-900/50 animate-spin"></div>
    </div>
  );
};

export default Loader;

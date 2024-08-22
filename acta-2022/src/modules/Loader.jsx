const Loader = () => {
  return (
    <div className="flex items-center justify-center loading-spinner">
      {/* Spinner */}
      <div className="border-4 border-white rounded-full w-7 h-7 border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loader;

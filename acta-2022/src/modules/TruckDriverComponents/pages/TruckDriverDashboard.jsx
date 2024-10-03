import { useAuth } from "../../../AuthContext";

const TruckDriverDashboard = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen loading-spinner">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 rounded-full border-t-transparent border-gray-900/50 animate-spin"></div>
      </div>
    ); // or you can display a fallback UI or redirect
  }
  return (
    <div className="flex flex-col items-start justify-start h-full px-6 py-10 gap-y-10">
      <h1 className="text-xl font-bold text-black">Coming Soon..........</h1>
      <div className="flex flex-col items-center justify-center">
        <h1>Login As : {currentUser.userType} </h1>
        <p>Email : {currentUser.email}</p>
        <p>Name : {currentUser.firstName}</p>
      </div>
    </div>
  );
};

export default TruckDriverDashboard;

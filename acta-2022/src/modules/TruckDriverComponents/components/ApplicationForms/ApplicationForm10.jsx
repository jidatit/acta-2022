import { FaBell } from "react-icons/fa";
const ApplicationForm10 = () => {
  return (
    <div className="flex flex-col items-start justify-start overflow-x-hidden h-full gap-y-12 w-[85%] md:w-[80%]">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className=" ml-1 smd:ml-0 flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Application Status
          </h1>
        </div>
        <FaBell className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer text-4xl" />
      </div>
      <div className="flex flex-col gap-y-5 w-full md:w-[95%]">
        <p className="text-black font-radios text-lg">
          Your Application Successfully submitted . You Successfully completed
          All Steps of Application Now wait until we give you some Response..
        </p>
      </div>
    </div>
  );
};

export default ApplicationForm10;

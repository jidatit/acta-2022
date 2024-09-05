import { useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { FaBell } from "react-icons/fa";
const ApplicationForm6 = () => {
  const { setIsSaveClicked } = useAuth();
  useEffect(() => {
    setIsSaveClicked(true);
  }, []);
  return (
    <div className="flex flex-col items-start justify-start h-full gap-y-12 w-[86%] md:w-[80%] flex-wrap overflow-x-hidden">
      <div className="flex flex-row items-start justify-start w-full ">
        <div className="flex flex-col items-start justify-start w-full">
          <h1 className="w-full mb-4 text-xl font-bold text-black">
            Certifications of violations
          </h1>
          <p className="mt-3 text-lg text-black font-radios">
            Each driver shall furnish the list required in accordance with
            paragraph (a) of this section. If the driver has not been convicted
            of, or forfeited bond or collateral on account of, any violation
            which must be listed he/she shall so certify.I certify that the
            following is a true and complete list of traffic violations (other
            than parking violations) for which I have been convicted or
            forfeited bond or collateral during the past 12 months.
          </p>
          <p className="mt-3 text-lg text-black font-radios">
            §391.27 Record of violations DRIVER'S CERTIFICATION
          </p>
        </div>

        <FaBell
          size={45}
          className="p-2 text-white bg-blue-700 rounded-md shadow-lg cursor-pointer"
        />
      </div>

      <div className="flex flex-col w-[90%] md:w-[85%] gap-y-8">
        <form className="w-full p-6 bg-white shadow-md">
          <div className="flex flex-row mb-6 gap-x-2">
            <input type="checkbox" className="p-3" />
            <p className="text-lg text-black font-radios">
              No accidents in past 3 years
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm6;

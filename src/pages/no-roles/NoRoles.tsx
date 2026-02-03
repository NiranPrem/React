import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const NoRoles = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex items-center justify-center h-full bg-[#F5F5F5] text-[#182953]">
      <div className="w-full flex flex-col justify-center items-center p-8 ">
        <h1 className="text-2xl font-bold mb-2">Hi {user?.name || ""},</h1>
        <p className="text-xl text-gray-700">
          No roles assigned to your account. Please contact administrator.
        </p>
      </div>
    </div>
  );
};

export default NoRoles;

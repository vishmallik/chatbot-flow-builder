import { memo, useEffect } from "react";
import { toast } from "react-toastify";

type TopBarProps = {
  onSave: () => void;
  message: {
    status: string;
    message: string;
  } | null;
};

function TopBar({ onSave, message }: TopBarProps) {
  //Run this side effect when message Props changes and display a Success or Failure toast
  useEffect(() => {
    if (message?.status === "success") {
      toast.success(message.message);
    }
    if (message?.status === "failure") {
      toast.warn(message.message);
    }
  }, [message]);
  return (
    <div className="w-full px-10 py-4 bg-gray-200 flex justify-end items-center">
      <button
        type="button"
        className="bg-white rounded-md px-4 py-2 border border-indigo-500 border-solid text-indigo-500 font-semibold mr-20 hover:text-white hover:bg-indigo-500 active:bg-indigo-600"
        onClick={onSave}
      >
        Save Changes
      </button>
    </div>
  );
}

export default memo(TopBar);

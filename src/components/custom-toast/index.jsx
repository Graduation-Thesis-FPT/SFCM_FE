import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "@/constants";

const Succsess = ({ message }) => {
  return (
    <span className="flex items-center">
      <CircleCheckBig size={16} className="mr-2" /> {message}
    </span>
  );
};

const Error = ({ message }) => {
  return (
    <span className="flex items-center">
      <CircleX size={16} className="mr-2" /> {message}
    </span>
  );
};

const Warning = ({ message }) => {
  return (
    <span className="flex items-center">
      <CircleAlert size={16} className="mr-2" /> {message}
    </span>
  );
};

export const useCustomToast = () => {
  const { toast } = useToast();

  const success = (mess, duration) => {
    if (typeof mess !== "string") {
      mess = SUCCESS_MESSAGE[mess?.data?.message] || "Thao tác thành công";
    }
    toast({
      variant: "success",
      title: <Succsess message={mess} />,
      duration: duration ?? 2000
    });
  };

  const warning = (mess, duration) => {
    toast({
      variant: "warning",
      title: <Warning message={mess} />,
      duration: duration ?? 2000
    });
  };

  const error = (mess, duration) => {
    if (typeof mess !== "string") {
      mess =
        ERROR_MESSAGE[mess?.response?.data?.message] ||
        mess?.response?.data?.message ||
        mess.message ||
        "Lỗi không xác định";
    }
    toast({
      variant: "error",
      title: <Error message={mess} />,
      duration: duration ?? 2000
    });
  };

  return {
    success,
    warning,
    error
  };
};

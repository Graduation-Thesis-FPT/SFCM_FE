import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
import { useToast } from "../ui/use-toast";

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

  const success = (message, duration) => {
    toast({
      variant: "success",
      title: <Succsess message={message} />,
      duration: duration ?? 2000
    });
  };

  const warning = (message, duration) => {
    toast({
      variant: "warning",
      title: <Warning message={message} />,
      duration: duration ?? 2000
    });
  };

  const error = (message, duration) => {
    toast({
      variant: "error",
      title: <Error message={message} />,
      duration: duration ?? 2000
    });
  };

  return {
    success,
    warning,
    error
  };
};

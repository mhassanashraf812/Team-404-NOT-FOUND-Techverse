import { toast } from "sonner";
import { IconX } from "@tabler/icons-react";

const cancelButton = {
  label: <IconX className="size-5 p-0 m-0 text-black cursor-pointer" />,
  onClick: () => {},
};

export const ToastSuccessMessage = (message: string, text?: string) => {
  if (!message) return;
  if (text) message += ` - ${text}`;
  toast.success(message, { cancel: cancelButton });
};

export const ToastErrorMessage = (error: any) => {
  if (!error) return;
  let errorMessage = "An unknown error occurred";
  let rawText: string | undefined;

  if (typeof error === "string") {
    errorMessage = error || errorMessage;
  } else if (typeof error === "object" && error !== null) {
    const responseError = error as {
      response?: { data?: { message?: string; error?: string; text?: string } };
    };

    const data = responseError.response?.data;
    rawText = data?.text;
    console.log(data, "data");
    errorMessage = data?.message || data?.error || errorMessage;
  }

  if (rawText) {
    errorMessage += ` - ${rawText}`;
  }

  toast.error(errorMessage, { cancel: cancelButton });
};

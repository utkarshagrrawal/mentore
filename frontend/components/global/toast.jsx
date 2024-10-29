import toast from "react-hot-toast";

export function SuccessNotify(message) {
  toast.success(message, {
    duration: 1500,
    position: "top-center",
  });
}

export function ErrorNotify(message) {
  toast.error(message, {
    duration: 1500,
    position: "top-center",
  });
}

export function Loading(message) {
  toast.loading(message);
}

export function DismissToast(toastId) {
  toast.dismiss(toastId);
}

import toast from "react-hot-toast";

export const toastConfig = {
    position: "top-right",
    toastOptions: {
        duration: 3000,
        error: { duration: 5000},
    },
};

export const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
};
import { toast, Bounce, ToastOptions } from 'react-toastify';

export const showToast = (text: string, type: 'info' | 'success' | 'warn' | 'error') => {
    const baseOptions: ToastOptions = {
        position: "bottom-left",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
    };

    switch (type) {
        case 'success':
            toast.success(text, baseOptions);
            break;
        case 'warn':
            toast.warn(text, baseOptions);
            break;
        case 'error':
            toast.error(text, baseOptions);
            break;
        default:
            toast.info(text, baseOptions);
    }
};

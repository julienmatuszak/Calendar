import { ToastContainerProps } from 'react-toastify';

export const toastContainerProps: ToastContainerProps = {
  position: 'bottom-right',
  autoClose: Number(process.env.REACT_APP_TOAST_TIME_OUT),
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnHover: true,
  enableMultiContainer: true,
};

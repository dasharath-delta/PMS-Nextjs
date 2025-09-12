'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactToast = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default ReactToast;

import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen flex justify-center items-center">
      <p className="border-4 border-gray-800 border-t-gray-300 h-8 w-8 rounded-full animate-spin"></p>
    </div>
  );
};

export default Loading;

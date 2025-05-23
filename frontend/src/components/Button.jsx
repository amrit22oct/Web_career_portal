import { useState } from 'react';

const Button = ({ text, onClick, className = '', isLoading = false, variant = 'primary' }) => {
  const [loading, setLoading] = useState(isLoading);

  const handleClick = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  const getButtonStyles = () => {
    if (variant === 'primary') {
      return 'bg-blue-500 hover:bg-blue-600';
    } else if (variant === 'secondary') {
      return 'bg-gray-500 hover:bg-gray-600';
    } else if (variant === 'danger') {
      return 'bg-red-500 hover:bg-red-600';
    }
    return '';
  };

  return (
    <button
      onClick={handleClick}
      className={`py-2 px-4 rounded-md text-white transition duration-300 ${getButtonStyles()} ${className}`}
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin">🔄</span>  // Or use an actual spinner component
      ) : (
        text
      )}
    </button>
  );
};

export default Button;

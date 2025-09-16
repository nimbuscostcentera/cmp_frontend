// Components/LoadingSpinner.jsx
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  className = "",
}) => {
  return (
    <div
      className={`loading-spinner ${size} ${color} ${className}`}
      aria-label="Loading"
      role="status"
    >
      <div className="spinner"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;

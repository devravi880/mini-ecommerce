function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default LoadingSpinner;

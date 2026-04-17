export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      id="error-message"
      className="text-center py-20 fade-in-up"
      role="alert"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
        <svg
          className="w-10 h-10 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-muted max-w-md mx-auto mb-6">{message}</p>
      <button
        id="retry-button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium
          hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/20
          active:scale-95"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
          />
        </svg>
        Try Again
      </button>
    </div>
  );
}

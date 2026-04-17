import { useState } from "react";
import { Download, Loader } from "lucide-react";
import { downloadBook } from "../services/bookDownloadService";

interface BookDownloadButtonProps {
  bookId: string;
  filename?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function BookDownloadButton({
  bookId,
  filename,
  className = "",
  variant = "primary",
  size = "md",
}: BookDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await downloadBook(bookId, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download book";
      setError(message);
      console.error("Download error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-on-primary hover:bg-primary-container active:scale-95",
    secondary:
      "bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-95",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 active:scale-95",
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        title={isLoading ? "Downloading..." : "Download book as PDF"}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

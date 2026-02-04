import { Upload, X, Camera } from "lucide-react";
import { useState } from "react";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarData: string) => void;
  userName?: string;
}

/**
 * AvatarUpload - Component for uploading and managing user avatar
 * Supports image preview, drag-and-drop, and file validation
 */
export const AvatarUpload = ({
  currentAvatar,
  onAvatarChange,
  userName = "User",
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, and WebP images are allowed");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onAvatarChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    onAvatarChange("");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Avatar Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-blue-400">
              {getInitials(userName)}
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-400/10"
                : "border-white/20 bg-white/5 hover:border-blue-400 hover:bg-blue-400/5"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload avatar"
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex gap-2">
                <Upload size={20} className="text-blue-400" />
                <Camera size={20} className="text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">
                Drag and drop your image here
              </p>
              <p className="text-xs text-gray-400">
                or click to browse (JPEG, PNG, GIF, WebP - Max 5MB)
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
              <span>⚠</span>
              {error}
            </p>
          )}

          {/* Remove Button */}
          {preview && (
            <button
              onClick={handleRemoveAvatar}
              className="mt-3 px-4 py-2 text-sm font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Remove Avatar
            </button>
          )}
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-400">
        Your avatar is stored locally in your browser and will be displayed
        across your profile and dashboard.
      </p>
    </div>
  );
};

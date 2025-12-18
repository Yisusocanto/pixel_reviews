import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { Button, Avatar } from "@heroui/react";
import { UploadCloud, Trash2, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useUploadAvatar,
  useDeleteAvatar,
} from "@/hooks/fetching/settings/useAvatarSettings";
import axios from "axios";

interface AvatarProps {
  maxSize?: number; // bytes
  className?: string;
  onFileChange?: (file: File | null) => void;
  defaultAvatar?: string;
}

export default function AvatarSettings({
  maxSize = 4 * 1024 * 1024, // 4MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultAvatar || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl !== defaultAvatar &&
        !previewUrl.startsWith("http")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, defaultAvatar]);

  // Update preview when defaultAvatar changes (if no local file selected)
  useEffect(() => {
    if (!file) {
      setPreviewUrl(defaultAvatar || null);
    }
  }, [defaultAvatar, file]);

  const validateFile = (file: File): string[] => {
    const newErrors: string[] = [];
    if (!file.type.startsWith("image/")) {
      newErrors.push("Only image files are allowed.");
    }
    if (file.size > maxSize) {
      newErrors.push(`File size must be less than ${maxSize / 1024 / 1024}MB.`);
    }
    return newErrors;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationErrors = validateFile(selectedFile);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Clear selection on error
      setFile(null);
      setPreviewUrl(defaultAvatar || null);
      if (inputRef.current) inputRef.current.value = "";
      onFileChange?.(null);
      return;
    }

    setErrors([]);
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    onFileChange?.(selectedFile);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();

  const { mutate: deleteAvatar, isPending: isDeleting } = useDeleteAvatar();

  const handleDeleteAvatar = () => {
    deleteAvatar(undefined, {
      onSuccess: () => {
        toast.success("Avatar deleted successfully.");
        setFile(null);
        setPreviewUrl(null);
        onFileChange?.(null);
      },
      onError: (error) => {
        const errorMsj = axios.isAxiosError(error)
          ? error.response?.data.error
          : "Error deleting avatar.";
        toast.error(errorMsj);
      },
    });
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, file.name);

    uploadAvatar(formData, {
      onSuccess: () => {
        toast.success("Avatar uploaded successfully.");
        setFile(null); // Reset file input state as it's now 'persisted'
      },
      onError: (error: any) => {
        const errorMsj = axios.isAxiosError(error)
          ? error.response?.data.error
          : "Error uploading avatar.";
        toast.error(errorMsj);
      },
    });
  };

  const handleRemoveSelected = () => {
    setFile(null);
    setPreviewUrl(defaultAvatar || null);
    setErrors([]);
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Avatar Preview Area */}
      <div className="relative group">
        <div
          className={cn(
            "relative h-40 w-40 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-content1",
            isDragging
              ? "border-primary scale-105 ring-4 ring-primary/20"
              : "border-default-200 group-hover:border-primary/50",
            !previewUrl && "border-dashed"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={openFileDialog}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onInputChange}
          />

          {previewUrl ? (
            <Avatar className="w-full h-full">
              <Avatar.Image
                src={previewUrl}
                className="w-full h-full object-cover"
                alt="Avatar Preview"
              />
              <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-default-100">
                <ImageIcon className="w-8 h-8 text-default-400" />
              </Avatar.Fallback>
            </Avatar>
          ) : (
            <div className="flex flex-col items-center justify-center text-default-400 gap-2">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-medium">Upload</span>
            </div>
          )}

          {/* Overlay on hover/drag */}
          <div
            className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-200 pointer-events-none",
              (isDragging || !previewUrl) && "opacity-0",
              previewUrl && "group-hover:opacity-100"
            )}
          >
            <UploadCloud className="text-white w-8 h-8" />
          </div>
        </div>

        {/* Remove Selected Button (Only for new file selection) */}
        {file && (
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="absolute top-0 right-0 z-10 shadow-sm bg-background border-small border-danger/50 text-danger"
            onPress={handleRemoveSelected}
            aria-label="Remove selected image"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Info & Errors */}
      <div className="text-center space-y-1">
        <h3 className="text-small font-semibold text-default-700">
          {file ? file.name : "Profile Photo"}
        </h3>
        <p className="text-tiny text-default-500">
          Recommended: square JPG, PNG. Max {formatBytes(maxSize)}
        </p>

        {errors.length > 0 && (
          <div className="text-tiny text-danger flex flex-col items-center gap-1 mt-2 bg-danger/10 p-2 rounded-lg">
            {errors.map((error, idx) => (
              <span key={idx}>{error}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full justify-center sm:max-w-xs">
        <Button
          variant="secondary"
          onPress={openFileDialog}
          isDisabled={isUploading || isDeleting}
          className="flex-1 "
        >
          Change
        </Button>

        {file ? (
          <Button
            variant="primary"
            onPress={handleUpload}
            isPending={isUploading}
            isDisabled={isDeleting || errors.length > 0}
            className="flex-1"
          >
            {isUploading ? "Save" : "Save"}
          </Button>
        ) : defaultAvatar ? (
          <Button
            variant="danger-soft"
            onPress={handleDeleteAvatar}
            isPending={isDeleting}
            isDisabled={isUploading}
            className="flex-1 "
          >
            {!isDeleting && <Trash2 size={16} />}
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

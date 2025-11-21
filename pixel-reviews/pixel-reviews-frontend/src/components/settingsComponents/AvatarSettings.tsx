import { useState } from "react";
// Hooks
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
// Components
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TriangleAlert, User, X } from "lucide-react";
import AccentButton from "../commonsComponents/AccentButton";
// Utils
import { cn } from "@/lib/utils";
// Services
import {
  useUploadAvatar,
  useDeleteAvatar,
} from "@/hooks/fetching/settings/useAvatarSettings";
interface AvatarProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

export default function Avatar({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
      setSuccessMsg(null);
    }
  };

  // Obtain the native File safely
  const getNativeFile = (f?: FileWithPreview): File | null => {
    if (!f) return null;
    // @ts-ignore
    if (f.nativeFile instanceof File) return f.nativeFile;
    // @ts-ignore
    if (f.file instanceof File) return f.file;
    return null;
  };

  const {
    mutate: uploadAvatar,
    isPending: isUploading,
    isError: isUploadError,
    error: uploadError,
  } = useUploadAvatar();

  const {
    mutate: deleteAvatar,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteAvatar();

  const handleDeleteAvatar = () => {
    setSuccessMsg(null);

    deleteAvatar(undefined, {
      onSuccess: () => {
        setSuccessMsg("Avatar deleted successfully.");
      },
    });
  };

  const handleUpload = () => {
    setSuccessMsg(null);

    const nativeFile = getNativeFile(currentFile);
    if (!nativeFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", nativeFile, nativeFile.name);

    uploadAvatar(formData, {
      onSuccess: () => {
        setSuccessMsg("Avatar uploaded successfully.");
      },
    });
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative h-34 w-34 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl && "border-solid"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            // previewUrl can be a data URL or a remote URL
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Button to delete avatar (only if a file is selected) */}
        {currentFile && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="size-6 absolute end-0 top-0 rounded-full"
            aria-label="Remove avatar"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center space-y-0.5">
        <p className="text-sm font-medium">
          {currentFile ? "Avatar seleccionado" : "Subir avatar"}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG to {formatBytes(maxSize)}
        </p>
      </div>

      {/* Error Messages from hook */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-5">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Errors uploading the file</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* Server or success messages */}
      {(isUploadError || isDeleteError) && (
        <Alert variant="destructive" appearance="light" className="mt-5">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {isUploadError
                ? (uploadError as any)?.response?.data?.error ||
                  "Unknown upload error."
                : (deleteError as any)?.response?.data?.error ||
                  "Unknown delete error."}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {successMsg && (
        <Alert className="mt-5">
          <AlertContent>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </AlertContent>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={openFileDialog} variant="ghost">
          Select
        </Button>
        <AccentButton
          size="sm"
          onClick={handleUpload}
          disabled={
            !currentFile || isUploading || isDeleting || errors.length > 0
          }
        >
          {isUploading ? "Uploading..." : "Send"}
        </AccentButton>
      </div>
      {defaultAvatar && (
        <Button
          variant="destructive"
          className="rounded-2xl"
          onClick={handleDeleteAvatar}
          disabled={isDeleting || isUploading}
        >
          {isDeleting ? "Deleting..." : "Delete avatar"}
        </Button>
      )}
    </div>
  );
}

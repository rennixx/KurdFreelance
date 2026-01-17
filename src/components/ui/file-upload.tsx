"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  File,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: "default" | "avatar" | "compact";
  existingFiles?: { url: string; name: string }[];
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  url?: string;
  error?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf") || type.includes("document")) return FileText;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileUpload({
  bucket,
  path = "",
  accept = "*",
  maxSize = 10,
  maxFiles = 5,
  multiple = false,
  onUploadComplete,
  onError,
  className,
  variant = "default",
  existingFiles = [],
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.replace("/*", "/"));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return "File type not accepted";
      }
    }

    return null;
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      const fileName = `${Date.now()}-${uploadedFile.file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "uploading" as const } : f
        )
      );

      // Simulate progress (Supabase doesn't provide progress events)
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === uploadedFile.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          })
        );
      }, 200);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, uploadedFile.file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "complete" as const, progress: 100, url: urlData.publicUrl }
            : f
        )
      );

      return urlData.publicUrl;
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "error" as const, error: error.message }
            : f
        )
      );
      throw error;
    }
  };

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList);

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles: UploadedFile[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          newFiles.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            progress: 0,
            status: "pending",
          });
        }
      });

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        onError?.(errors.join(", "));
      }

      if (newFiles.length === 0) return;

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload files
      const uploadPromises = newFiles.map((f) => uploadFile(f));
      try {
        const urls = await Promise.all(uploadPromises);
        onUploadComplete?.(urls);
        toast.success(`${urls.length} file(s) uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [files, maxFiles, onUploadComplete, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  if (variant === "avatar") {
    return (
      <div className={cn("relative group", className)}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div
          onClick={openFilePicker}
          className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-green-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
        >
          {files.length > 0 && files[0].url ? (
            <Image
              src={files[0].url}
              alt="Avatar"
              fill
              className="object-cover rounded-full"
            />
          ) : files.length > 0 && files[0].status === "uploading" ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload Photo</span>
            </div>
          )}
        </div>
        {files.length > 0 && files[0].url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile(files[0].id);
            }}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={openFilePicker}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
              >
                {file.status === "uploading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : file.status === "complete" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : file.status === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <File className="h-4 w-4" />
                )}
                <span className="flex-1 truncate">{file.file.name}</span>
                <button onClick={() => removeFile(file.id)}>
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFilePicker}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-green-500 hover:bg-gray-50"
        )}
      >
        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {accept === "*" ? "All file types" : accept} • Max {maxSize}MB
          {multiple && ` • Up to ${maxFiles} files`}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {file.file.type.startsWith("image/") && file.url ? (
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                    <Image
                      src={file.url}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                    <FileIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.file.size)}
                  </p>
                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="h-1 mt-2" />
                  )}
                  {file.status === "error" && (
                    <p className="text-sm text-red-500 mt-1">{file.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  )}
                  {file.status === "complete" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Existing Files</p>
          <div className="space-y-2">
            {existingFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <File className="h-5 w-5 text-gray-500" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useRef, ChangeEvent, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  placeholderText?: string;
  className?: string;
  accept?: string;
  required?: boolean;
}

const FileUpload = ({
  file,
  onChange,
  placeholderText = "Click to upload or drag and drop",
  className,
  accept,
  required,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a preview for image files
  const updatePreview = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setPreview(null);
    }
  }, []);

  // Update preview when file changes
  useEffect(() => {
    updatePreview(file);
  }, [file, updatePreview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
    updatePreview(selectedFile);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (!droppedFile) return;

      // Check if the file type is acceptable
      if (accept) {
        const acceptableTypes = accept.split(",").map((type) => type.trim());
        const isAcceptable = acceptableTypes.some((type) => {
          if (type.startsWith(".")) {
            // Check file extension
            return droppedFile.name.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.includes("*")) {
            // Handle wildcards like image/*
            const [category] = type.split("/");
            return droppedFile.type.startsWith(`${category}/`);
          } else {
            // Exact match
            return droppedFile.type === type;
          }
        });

        if (!isAcceptable) {
          alert("File type not accepted");
          return;
        }
      }

      onChange(droppedFile);
      updatePreview(droppedFile);
    },
    [accept, onChange, updatePreview]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed rounded-md transition-colors",
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:bg-gray-100",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        required={required}
        ref={fileInputRef}
      />

      {file && preview ? (
        // Image preview
        <div className="relative w-full h-full flex flex-col items-center">
          <div className="relative h-32 w-32 my-2">
            <img
              src={preview}
              alt="File preview"
              className="w-full h-full object-contain rounded"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">
            {file.name}
          </p>
        </div>
      ) : file ? (
        // Non-image file
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          <div className="flex items-center bg-white px-3 py-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate max-w-[200px]">
              {file.name}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        // Upload placeholder
        <div className="flex flex-col items-center justify-center p-4">
          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">{placeholderText}</p>
          <p className="text-xs text-gray-400 mt-1">
            {accept
              ? `Accepted formats: ${accept
                  .replace(/\./g, "")
                  .replace(/,/g, ", ")}`
              : "Any file format"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            Select File
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

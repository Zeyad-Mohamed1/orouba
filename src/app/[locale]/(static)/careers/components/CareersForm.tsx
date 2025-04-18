"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const CareersForm = () => {
  const t = useTranslations("Careers.form");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Check file type (PDF or image files)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError(t("fileError.type"));
      setSelectedFile(null);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError(t("fileError.size"));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setErrorMessage("");

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !selectedFile) {
      setErrorMessage(t("validation.required"));
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload file first
      const fileFormData = new FormData();
      fileFormData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: fileFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error(t("errors.fileUpload"));
      }

      const { filePath } = await uploadResponse.json();

      // Submit the career application with the file path
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cv: filePath,
        }),
      });

      if (!response.ok) {
        throw new Error(t("errors.submission"));
      }

      toast.success(t("success"));
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh page after 3 seconds
      setTimeout(() => {
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(t("errors.general"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-semibold mb-6 text-primary">{t("title")}</h3>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.name.label")} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("fields.name.placeholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.email.label")} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("fields.email.placeholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.phone.label")} *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("fields.phone.placeholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.position.label")}
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder={t("fields.position.placeholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="cv"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.cv.label")} *
          </label>
          <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <input
              type="file"
              id="cv"
              name="cv"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-primary file:text-white hover:file:bg-primary/90"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              {t("fields.cv.formats")}
            </p>
          </div>
          {fileError && (
            <p className="mt-2 text-sm text-red-600">{fileError}</p>
          )}
          {selectedFile && (
            <p className="mt-2 text-sm text-green-600">
              {t("fields.cv.selected")}: {selectedFile.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("fields.message.label")}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("fields.message.placeholder")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition duration-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("buttons.processing")}
            </span>
          ) : (
            t("buttons.submit")
          )}
        </button>
      </form>
    </div>
  );
};

export default CareersForm;

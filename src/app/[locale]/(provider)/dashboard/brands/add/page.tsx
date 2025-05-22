"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import {
  Form,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormHelperText,
  FormActions,
  FormSection,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Image,
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
} from "lucide-react";
import Editor from "@/components/ui/mdx-editor";
import axios from "axios"
import toast from "react-hot-toast";

const STEPS = {
  BASIC_INFO: 0,
  CONTENT: 1,
  STYLING: 2,
  MEDIA: 3,
  REVIEW: 4,
  CONFIRM: 5,
};

interface FormData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  brand_text_ar: string;
  brand_text_en: string;
  color: string;
  main_image: File | null;
  banner: File | null;
  small_img: File | null;
  main_image_preview?: string;
  banner_preview?: string;
  small_img_preview?: string;
}

export default function AddBrandPage() {
  const router = useRouter();
  const t = useTranslations("brands");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    brand_text_ar: "",
    brand_text_en: "",
    color: "#3B82F6",
    main_image: null,
    banner: null,
    small_img: null,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  console.log(formData);

  // Update form data on input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Reset review status if form data changes
    if (hasReviewed) {
      setHasReviewed(false);
    }
  };

  // Update rich text editor onChange handlers with proper types
  const handleRichTextChange = (name: string, value: string) => {
    // Create a new copy of the form data to ensure no reference issues
    const newFormData = { ...formData };
    newFormData[name as keyof typeof formData] = value as any;
    setFormData(newFormData);

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Reset review status if form data changes
    if (hasReviewed) {
      setHasReviewed(false);
    }
  };

  // Helper function to compress image
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Helper function to compress video
  const compressVideo = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const video = document.createElement('video');
        video.src = event.target?.result as string;
        video.onloadedmetadata = () => {
          // Create a canvas with reduced dimensions
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 640;
          const MAX_HEIGHT = 360;

          let width = video.videoWidth;
          let height = video.videoHeight;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw video frame to canvas
          const ctx = canvas.getContext('2d');
          video.currentTime = 0;
          video.onseeked = () => {
            ctx?.drawImage(video, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', 0.7);
            resolve(base64);
          };
        };
        video.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Update file input onChange handlers with proper types
  const handleFileChange = async (
    name: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      if (file.size > maxSize) {
        setError(t("errors.fileTooLarge"));
        e.target.value = "";
        return;
      }

      try {
        let base64String: string;

        // Handle different file types
        if (file.type.startsWith('image/')) {
          base64String = await compressImage(file);
        } else if (file.type.startsWith('video/')) {
          base64String = await compressVideo(file);
        } else {
          throw new Error(t("errors.unsupportedFileType"));
        }

        // Create a preview URL for the UI
        const previewUrl = URL.createObjectURL(file);

        // Update form data with both base64 and preview
        setFormData((prev) => ({
          ...prev,
          [name]: base64String,
          [`${name}_preview`]: previewUrl
        }));

      } catch (error) {
        console.error("Error processing file:", error);
        setError(t("errors.fileProcessingError"));
        e.target.value = "";
      }
    }
  };

  // Handle color picker change
  const handleColorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, color: value }));

    // Clear validation error for color if it exists
    if (validationErrors.color) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.color;
        return newErrors;
      });
    }

    // Reset review status if form data changes
    if (hasReviewed) {
      setHasReviewed(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case STEPS.BASIC_INFO:
        if (!formData.name_ar) errors.name_ar = t("errors.required");
        if (!formData.name_en) errors.name_en = t("errors.required");
        if (!formData.description_ar)
          errors.description_ar = t("errors.required");
        if (!formData.description_en)
          errors.description_en = t("errors.required");
        break;

      case STEPS.CONTENT:
        if (!formData.brand_text_ar)
          errors.brand_text_ar = t("errors.required");
        if (!formData.brand_text_en)
          errors.brand_text_en = t("errors.required");
        break;

      case STEPS.STYLING:
        if (!formData.color) {
          errors.color = t("errors.required");
        } else if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.color)) {
          errors.color = t("errors.invalidColor");
        }
        break;

      // No required fields for the media step

      // For review step, check if user has marked as reviewed
      case STEPS.REVIEW:
        if (!hasReviewed) {
          errors.review = t("errors.notReviewed");
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle review confirmation
  const handleReviewConfirmation = () => {
    setHasReviewed(true);
    setValidationErrors({});
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // If in review step and hasn't been reviewed yet, don't proceed
      if (currentStep === STEPS.REVIEW && !hasReviewed) {
        return;
      }

      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0); // Scroll to top when changing steps
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || isLoading) {
      return;
    }

    // Final validation before submission
    let isValid = true;
    for (let step = 0; step < STEPS.REVIEW; step++) {
      if (!validateStep(step)) {
        isValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (!isValid || !hasReviewed) return;

    setIsLoading(true);
    setIsSubmitting(true);
    setError("");

    try {
      // Create the request payload
      const payload = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        brand_text_ar: formData.brand_text_ar,
        brand_text_en: formData.brand_text_en,
        color: formData.color,
        main_image: formData.main_image,
        banner: formData.banner,
        small_img: formData.small_img,
      };

      console.log("Sending request to /api/brands...");

      // Send the request to the API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/brands`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
          maxContentLength: 50 * 1024 * 1024,
          maxBodyLength: 50 * 1024 * 1024,
        }
      );

      if (response?.status === 201) {
        toast.success(t("success"));
        router.push("/dashboard/brands");
        router.refresh();
      } else {
        throw new Error(t("errors.failed"));
      }
    } catch (err) {
      console.error("Error adding brand:", err);
      setError(err instanceof Error ? err.message : t("errors.failed"));
      toast.error(err instanceof Error ? err.message : t("errors.failed"));
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { index: STEPS.BASIC_INFO, label: t("steps.basicInfo") },
      { index: STEPS.CONTENT, label: t("steps.content") },
      { index: STEPS.STYLING, label: t("steps.styling") },
      { index: STEPS.MEDIA, label: t("steps.media") },
      { index: STEPS.REVIEW, label: t("steps.review") },
      { index: STEPS.CONFIRM, label: t("steps.confirm") },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`${currentStep >= step.index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
                  } h - 8 w - 8 rounded - full flex items - center justify - center font - medium text - sm transition - colors`}
              >
                {currentStep > step.index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500">
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2 mx-4">
          <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 h-1 bg-blue-600 transition-all"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}% ` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render form step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <FormSection
            className="space-y-3"
            title={t("sections.brandInfo")}
            subtitle={t("sections.brandInfoDescription")}
          >
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="name_ar">{t("fields.nameAr")}</FormLabel>
                <FormInput
                  id="name_ar"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("placeholders.nameAr")}
                  error={!!validationErrors.name_ar}
                  required
                />
                {validationErrors.name_ar && (
                  <FormHelperText error>
                    {validationErrors.name_ar}
                  </FormHelperText>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="name_en">{t("fields.nameEn")}</FormLabel>
                <FormInput
                  id="name_en"
                  name="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange(e)}
                  placeholder={t("placeholders.nameEn")}
                  error={!!validationErrors.name_en}
                  required
                />
                {validationErrors.name_en && (
                  <FormHelperText error>
                    {validationErrors.name_en}
                  </FormHelperText>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup span="full">
              <FormLabel htmlFor="description_ar">
                {t("fields.descriptionAr")}
              </FormLabel>
              <Editor
                value={formData.description_ar}
                onChange={(value) =>
                  handleRichTextChange("description_ar", value)
                }
                key="description_ar_editor"
              />
              {validationErrors.description_ar && (
                <FormHelperText error>
                  {validationErrors.description_ar}
                </FormHelperText>
              )}
            </FormGroup>

            <FormGroup span="full">
              <FormLabel htmlFor="description_en">
                {t("fields.descriptionEn")}
              </FormLabel>
              <Editor
                value={formData.description_en}
                onChange={(value) =>
                  handleRichTextChange("description_en", value)
                }
                key="description_en_editor"
              />
              {validationErrors.description_en && (
                <FormHelperText error>
                  {validationErrors.description_en}
                </FormHelperText>
              )}
            </FormGroup>
          </FormSection>
        );

      case STEPS.CONTENT:
        return (
          <FormSection
            className="space-y-3"
            title={t("sections.brandContent")}
            subtitle={t("sections.brandContentInfo")}
          >
            <FormGroup span="full">
              <FormLabel htmlFor="brand_text_ar">
                {t("fields.brandTextAr")}
              </FormLabel>
              <Editor
                value={formData.brand_text_ar}
                onChange={(value) =>
                  handleRichTextChange("brand_text_ar", value)
                }
                key="brand_text_ar_editor"
              />
              {validationErrors.brand_text_ar && (
                <FormHelperText error>
                  {validationErrors.brand_text_ar}
                </FormHelperText>
              )}
            </FormGroup>

            <FormGroup span="full">
              <FormLabel htmlFor="brand_text_en">
                {t("fields.brandTextEn")}
              </FormLabel>
              <Editor
                value={formData.brand_text_en}
                onChange={(value) =>
                  handleRichTextChange("brand_text_en", value)
                }
                key="brand_text_en_editor"
              />
              {validationErrors.brand_text_en && (
                <FormHelperText error>
                  {validationErrors.brand_text_en}
                </FormHelperText>
              )}
            </FormGroup>
          </FormSection>
        );

      case STEPS.STYLING:
        return (
          <FormSection
            className="space-y-3"
            title={t("sections.styling")}
            subtitle={t("sections.stylingInfo")}
          >
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="color">{t("fields.color")}</FormLabel>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="color_text"
                      name="color_text"
                      type="text"
                      value={formData.color}
                      placeholder="#RRGGBB"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        handleColorChange(e.target.value);
                        const colorInput = document.getElementById(
                          "color"
                        ) as HTMLInputElement;
                        if (colorInput) colorInput.value = e.target.value;
                      }}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      required
                      className="h-10 w-12 p-0 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                      onChange={(e) => {
                        handleColorChange(e.target.value);
                        const textInput = document.getElementById(
                          "color_text"
                        ) as HTMLInputElement;
                        if (textInput) textInput.value = e.target.value;
                      }}
                    />
                  </div>
                </div>
                {validationErrors.color && (
                  <FormHelperText error>
                    {validationErrors.color}
                  </FormHelperText>
                )}
              </FormGroup>

              {/* Color Preview */}
              <FormGroup>
                <FormLabel>{t("fields.colorPreview")}</FormLabel>
                <div className="border border-gray-300 rounded-md shadow-sm h-10 overflow-hidden">
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                </div>
                <FormHelperText>{t("helpers.colorPreview")}</FormHelperText>
              </FormGroup>
            </FormRow>
          </FormSection>
        );

      case STEPS.MEDIA:
        return (
          <FormSection
            className="space-y-3"
            title={t("sections.media")}
            subtitle={t("sections.mediaInfo")}
          >
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="main_image">
                  {t("fields.mainImage")}
                </FormLabel>
                <FormInput
                  id="main_image"
                  name="main_image"
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFileChange("main_image", e)
                  }
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.main_image_preview && (
                  <div className="mt-2">
                    <img
                      src={formData.main_image_preview}
                      alt="Main image preview"
                      className="h-24 object-contain rounded border border-gray-200"
                    />
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="banner">{t("fields.banner")}</FormLabel>
                <FormInput
                  id="banner"
                  name="banner"
                  type="file"
                  accept="video/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFileChange("banner", e)
                  }
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.banner_preview && (
                  <div className="mt-2">
                    <video
                      src={formData.banner_preview}
                      controls
                      className="h-24 w-full object-contain rounded border border-gray-200"
                    />
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="small_img">
                  {t("fields.smallImg")}
                </FormLabel>
                <FormInput
                  id="small_img"
                  name="small_img"
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFileChange("small_img", e)
                  }
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.small_img_preview && (
                  <div className="mt-2">
                    <img
                      src={formData.small_img_preview}
                      alt="Small image preview"
                      className="h-24 object-contain rounded border border-gray-200"
                    />
                  </div>
                )}
              </FormGroup>
            </FormRow>
          </FormSection>
        );

      case STEPS.REVIEW:
        return (
          <>
            <FormSection
              className="space-y-3"
              title={t("steps.review")}
              subtitle={t("sections.reviewDescription")}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.nameAr")}
                  </h4>
                  <p className="text-gray-900">
                    {formData.name_ar || t("review.notProvided")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.nameEn")}
                  </h4>
                  <p className="text-gray-900">
                    {formData.name_en || t("review.notProvided")}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t("fields.descriptionAr")}
                </h4>
                <div className="prose prose-sm max-w-none text-gray-900">
                  {formData.description_ar ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.description_ar,
                      }}
                    />
                  ) : (
                    <p>{t("review.notProvided")}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t("fields.descriptionEn")}
                </h4>
                <div className="prose prose-sm max-w-none text-gray-900">
                  {formData.description_en ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.description_en,
                      }}
                    />
                  ) : (
                    <p>{t("review.notProvided")}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t("fields.brandTextAr")}
                </h4>
                <div className="prose prose-sm max-w-none text-gray-900">
                  {formData.brand_text_ar ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.brand_text_ar,
                      }}
                    />
                  ) : (
                    <p>{t("review.notProvided")}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {t("fields.brandTextEn")}
                </h4>
                <div className="prose prose-sm max-w-none text-gray-900">
                  {formData.brand_text_en ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.brand_text_en,
                      }}
                    />
                  ) : (
                    <p>{t("review.notProvided")}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.color")}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded border border-gray-300"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                    <span className="text-gray-900">{formData.color}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.mainImage")}
                  </h4>
                  {formData.main_image_preview && (
                    <div className="mt-2">
                      <img
                        src={formData.main_image_preview}
                        alt="Main image preview"
                        className="h-20 object-contain rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.banner")}
                  </h4>
                  {formData.banner_preview && (
                    <div className="mt-2">
                      <video
                        src={formData.banner_preview}
                        controls
                        className="h-20 w-full object-contain rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.smallImg")}
                  </h4>
                  {formData.small_img_preview && (
                    <div className="mt-2">
                      <img
                        src={formData.small_img_preview}
                        alt="Small image preview"
                        className="h-20 object-contain rounded border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">
                    {t("review.confirmTitle")}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {t("review.confirmDescription")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="review-confirmation"
                  checked={hasReviewed}
                  onChange={() => handleReviewConfirmation()}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="review-confirmation"
                  className="ml-2 block text-sm font-medium text-blue-800"
                >
                  {t("review.confirmCheck")}
                </label>
              </div>

              {validationErrors.review && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.review}
                </p>
              )}
            </div>
          </>
        );

      case STEPS.CONFIRM:
        return (
          <FormSection
            className="space-y-3"
            title={t("steps.confirm")}
            subtitle={t("sections.confirmDescription")}
          >
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("confirm.title")}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {t("confirm.description")}
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 inline-block mx-auto">
                <p className="font-medium text-gray-900">
                  {formData.name_en} / {formData.name_ar}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                {t("confirm.warningText")}
              </p>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  // Render navigation buttons based on current step
  const renderStepNavigation = () => {
    const isFirstStep = currentStep === 0;
    const isReviewStep = currentStep === STEPS.REVIEW;
    const isLastStep = currentStep === STEPS.CONFIRM;

    return (
      <FormActions>
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="mr-auto"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t("steps.previous")}
          </Button>
        )}

        {isLastStep ? (
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                {t("creating")}
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                {t("createBrand")}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNextStep}
            disabled={isReviewStep && !hasReviewed}
            className={`bg - blue - 600 hover: bg - blue - 700 ${isReviewStep && !hasReviewed
              ? "opacity-50 cursor-not-allowed"
              : ""
              } `}
          >
            {t("steps.next")}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </FormActions>
    );
  };

  return (
    <div>
      <PageHeader
        title={t("addBrand")}
        buttonLabel={t("backToBrands")}
        buttonHref="/dashboard/brands"
        buttonIcon="back"
      />

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{t("errors.title")}</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mb-10 mx-auto space-y-2"
        noValidate
      >
        {renderStepIndicator()}
        {renderStepContent()}
        {renderStepNavigation()}
      </form>
    </div>
  );
}

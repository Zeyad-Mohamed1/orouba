"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import {
  FormSection,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormHelperText,
  FormActions,
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
import { uploadFile } from "@/lib/imageUpload";

// Define steps for the form
const STEPS = {
  BASIC_INFO: 0,
  CONTENT: 1,
  STYLING: 2,
  MEDIA: 3,
  REVIEW: 4,
  CONFIRM: 5,
};

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  const t = useTranslations("brands");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    brand_text_ar: "",
    brand_text_en: "",
    color: "#3B82F6",
    main_image: "",
    banner: "",
    small_img: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/brands/${brandId}`);
        if (!response.ok) {
          throw new Error(t("loadingError"));
        }
        const data = await response.json();
        setFormData({
          name_ar: data.brand.name_ar || "",
          name_en: data.brand.name_en || "",
          description_ar: data.brand.description_ar || "",
          description_en: data.brand.description_en || "",
          brand_text_ar: data.brand.brand_text_ar || "",
          brand_text_en: data.brand.brand_text_en || "",
          color: data.brand.color || "#3B82F6",
          main_image: data.brand.main_image || "",
          banner: data.brand.banner || "",
          small_img: data.brand.small_img || "",
        });
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError(t("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId, t]);

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

  // Handle editor change
  const handleEditorChange = (name: string, value: string) => {
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

  // Validate current step before proceeding
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
    setError("");

    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name_ar", formData.name_ar);
      formDataToSend.append("name_en", formData.name_en);
      formDataToSend.append("description_ar", formData.description_ar);
      formDataToSend.append("description_en", formData.description_en);
      formDataToSend.append("brand_text_ar", formData.brand_text_ar);
      formDataToSend.append("brand_text_en", formData.brand_text_en);
      formDataToSend.append("color", formData.color);

      // Handle file uploads if they're new
      if (formData.main_image && formData.main_image.startsWith("data:")) {
        // Convert data URL to blob
        const response = await fetch(formData.main_image);
        const blob = await response.blob();
        formDataToSend.append("main_image", blob, "main_image.jpg");
      } else if (formData.main_image) {
        formDataToSend.append("main_image", formData.main_image);
      }

      if (formData.banner && formData.banner.startsWith("data:")) {
        const response = await fetch(formData.banner);
        const blob = await response.blob();
        formDataToSend.append("banner", blob, "banner.mp4");
      } else if (formData.banner) {
        formDataToSend.append("banner", formData.banner);
      }

      if (formData.small_img && formData.small_img.startsWith("data:")) {
        const response = await fetch(formData.small_img);
        const blob = await response.blob();
        formDataToSend.append("small_img", blob, "small_img.jpg");
      } else if (formData.small_img) {
        formDataToSend.append("small_img", formData.small_img);
      }

      // Send PUT request to update the brand
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("updateError"));
      }

      // Redirect to brand details page or brands list
      router.push(`/dashboard/brands/${brandId}`);
    } catch (error) {
      console.error("Error updating brand:", error);
      setError(t("updateError"));
      setCurrentStep(STEPS.REVIEW);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadFile(file);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Loading state
  if (isLoading && currentStep === STEPS.BASIC_INFO) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                className={`${
                  currentStep >= step.index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors`}
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
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="description_ar">
                  {t("fields.descriptionAr")}
                </FormLabel>
              </div>

              <div className="space-y-3">
                <Editor
                  value={formData.description_ar}
                  onChange={(value) =>
                    handleEditorChange("description_ar", value)
                  }
                />
              </div>

              {validationErrors.description_ar && (
                <FormHelperText error>
                  {validationErrors.description_ar}
                </FormHelperText>
              )}
            </FormGroup>

            <FormGroup span="full">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="description_en">
                  {t("fields.descriptionEn")}
                </FormLabel>
              </div>

              <div className="space-y-3">
                <Editor
                  value={formData.description_en}
                  onChange={(value) =>
                    handleEditorChange("description_en", value)
                  }
                />
              </div>

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
            title={t("sections.brandContent")}
            subtitle={t("sections.brandContentInfo")}
          >
            <FormGroup span="full">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="brand_text_ar">
                  {t("fields.brandTextAr")}
                </FormLabel>
              </div>

              <div className="space-y-3">
                <Editor
                  value={formData.brand_text_ar}
                  onChange={(value) =>
                    handleEditorChange("brand_text_ar", value)
                  }
                />
              </div>

              {validationErrors.brand_text_ar && (
                <FormHelperText error>
                  {validationErrors.brand_text_ar}
                </FormHelperText>
              )}
            </FormGroup>

            <FormGroup span="full">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="brand_text_en">
                  {t("fields.brandTextEn")}
                </FormLabel>
              </div>

              <div className="space-y-3">
                <Editor
                  value={formData.brand_text_en}
                  onChange={(value) =>
                    handleEditorChange("brand_text_en", value)
                  }
                />
              </div>

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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fileUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, main_image: fileUrl }));
                    }
                  }}
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.main_image && (
                  <div className="mt-2">
                    <img
                      src={formData.main_image}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fileUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, banner: fileUrl }));
                    }
                  }}
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.banner && (
                  <div className="mt-2">
                    <video
                      src={formData.banner}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fileUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({ ...prev, small_img: fileUrl }));
                    }
                  }}
                  icon={<Image className="h-4 w-4" />}
                />
                {formData.small_img && (
                  <div className="mt-2">
                    <img
                      src={formData.small_img}
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
                  {formData.main_image ? (
                    <div className="mt-2">
                      <img
                        src={formData.main_image}
                        alt="Main image preview"
                        className="h-20 object-contain rounded border border-gray-200"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">{t("review.notProvided")}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.banner")}
                  </h4>
                  {formData.banner ? (
                    <div className="mt-2">
                      <video
                        src={formData.banner}
                        controls
                        className="h-20 w-full object-contain rounded border border-gray-200"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">{t("review.notProvided")}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    {t("fields.smallImg")}
                  </h4>
                  {formData.small_img ? (
                    <div className="mt-2">
                      <img
                        src={formData.small_img}
                        alt="Small image preview"
                        className="h-20 object-contain rounded border border-gray-200"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">{t("review.notProvided")}</p>
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

  return (
    <div>
      <PageHeader
        title={t("editBrand")}
        buttonLabel={t("back")}
        buttonHref="/dashboard/brands"
        buttonIcon="back"
      />

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step indicator */}
        {renderStepIndicator()}

        {/* Form content */}
        {renderStepContent()}

        {/* Form actions */}
        <div className="mt-8 flex justify-between">
          {currentStep > STEPS.BASIC_INFO && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("previous")}
            </Button>
          )}

          {currentStep < STEPS.CONFIRM ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
              className="ml-auto"
            >
              {currentStep === STEPS.REVIEW ? t("steps.confirm") : t("next")}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? t("saving") : t("save")}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

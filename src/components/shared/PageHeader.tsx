"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonIcon?: "add" | "back";
  buttonAction?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  buttonIcon = "add",
  buttonAction,
  className = "",
  children,
}: PageHeaderProps) {
  const { locale } = useParams();
  const router = useRouter();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    // Check if locale is Arabic or another RTL language
    setIsRtl(locale === "ar");
  }, [locale]);

  const renderButton = () => {
    const IconComponent = buttonIcon === "add" ? Plus : ArrowLeft;

    const handleClick = () => {
      if (buttonAction) {
        buttonAction();
      } else if (buttonHref) {
        router.push(buttonHref);
      }
    };

    const button = (
      <Button
        onClick={handleClick}
        className={`${
          buttonIcon === "add"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 hover:bg-gray-700"
        } text-white shadow-sm`}
      >
        <IconComponent size={18} className="mr-2" />
        <span>{buttonLabel || (buttonIcon === "add" ? "Add" : "Back")}</span>
      </Button>
    );

    if (buttonHref && !buttonAction) {
      return <Link href={buttonHref}>{button}</Link>;
    }

    return button;
  };

  return (
    <div
      className={`flex items-center justify-between mb-6 ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        {children}
      </div>
      {(buttonLabel || buttonHref || buttonAction) && renderButton()}
    </div>
  );
}

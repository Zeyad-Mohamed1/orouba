"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const CareersMap = () => {
  const t = useTranslations("Contact");

  return (
    <div className="lg:col-span-7">
      <Card className="border-none shadow-xl h-full overflow-hidden">
        <CardHeader className="bg-primary/5 border-b px-8 py-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center">
              <MapPin className="mr-3 h-6 w-6 text-primary" />
              {t("map.title")}
            </div>
            <div className="flex items-center text-base font-normal text-muted-foreground">
              <Globe className="mr-2 h-4 w-4" />
              <span>{t("map.findUs")}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[560px] lg:h-[640px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7004.438704807096!2d31.452398!3d30.198869!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581a9954fd0425%3A0x3303686a7c8ac8b6!2z2KfZhNi52LHZiNio2Kkg2YTYtdmG2KfYudipINin2YTZhdmI2KfYryDYp9mE2LrYsNin2KbZitipINio2LPZhdip!5e1!3m2!1sar!2seg!4v1744856153772!5m2!1sar!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareersMap;

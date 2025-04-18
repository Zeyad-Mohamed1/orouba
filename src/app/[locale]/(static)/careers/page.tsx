import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

// Dynamically import components to avoid "Cannot find module" errors
const CareersMap = dynamic(() => import("./components/CareersMap"), {
  ssr: true,
  loading: () => <div className="h-[400px] bg-gray-200 animate-pulse" />,
});

const CareersForm = dynamic(() => import("./components/CareersForm"), {
  ssr: true,
});

const WhyChooseUs = dynamic(() => import("./components/WhyChooseUs"), {
  ssr: true,
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function Careers({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-5 order-2 md:order-1">
              <CareersForm />
            </div>

            <div className="md:col-span-7 order-1 md:order-2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                  {t("location.title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("location.description")}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-lg">
                <CareersMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <WhyChooseUs />
        </div>
      </section>
    </div>
  );
}

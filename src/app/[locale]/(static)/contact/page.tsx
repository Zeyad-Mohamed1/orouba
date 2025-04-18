"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormHelperText,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Send,
  User,
  AtSign,
  Building,
  Clock,
  Calendar,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(6, { message: "Phone number must be at least 6 characters" }),
  subject: z
    .string()
    .min(2, { message: "Subject must be at least 2 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

const Contact = () => {
  const t = useTranslations("Contact");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success(t("form.success"));
      form.reset();
    } catch (error) {
      toast.error(t("form.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-background to-background/90 py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <MapPin size={28} strokeWidth={2} />
              </div>
              <CardTitle className="text-xl">{t("map.addressTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p className="leading-relaxed">{t("map.address")}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <Phone size={28} strokeWidth={2} />
              </div>
              <CardTitle className="text-xl">{t("map.phoneTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p className="leading-relaxed">{t("map.phone")}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <Mail size={28} strokeWidth={2} />
              </div>
              <CardTitle className="text-xl">{t("map.emailTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p className="leading-relaxed">{t("map.email")}</p>
              <p className="mt-2 text-sm text-muted-foreground/80">
                {t("map.emailSupport")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-xl overflow-hidden backdrop-blur-sm">
              <CardHeader className="bg-primary/5 border-b px-8 py-6">
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="mr-3 h-6 w-6 text-primary" />
                  {t("form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormGroup>
                    <FormLabel className="flex items-center text-base font-medium">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      {t("form.name")}
                    </FormLabel>
                    <FormInput
                      placeholder={t("form.namePlaceholder")}
                      className="h-12 bg-card/30 backdrop-blur-sm focus:bg-card/50"
                      error={!!form.formState.errors.name}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <FormHelperText error>
                        {form.formState.errors.name.message}
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel className="flex items-center text-base font-medium">
                      <AtSign className="mr-2 h-4 w-4 text-primary" />
                      {t("form.email")}
                    </FormLabel>
                    <FormInput
                      placeholder={t("form.emailPlaceholder")}
                      className="h-12 bg-card/30 backdrop-blur-sm focus:bg-card/50"
                      type="email"
                      error={!!form.formState.errors.email}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <FormHelperText error>
                        {form.formState.errors.email.message}
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel className="flex items-center text-base font-medium">
                      <Phone className="mr-2 h-4 w-4 text-primary" />
                      {t("form.phone")}
                    </FormLabel>
                    <FormInput
                      placeholder={t("form.phonePlaceholder")}
                      className="h-12 bg-card/30 backdrop-blur-sm focus:bg-card/50"
                      type="tel"
                      error={!!form.formState.errors.phone}
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <FormHelperText error>
                        {form.formState.errors.phone.message}
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel className="flex items-center text-base font-medium">
                      <Building className="mr-2 h-4 w-4 text-primary" />
                      {t("form.subject")}
                    </FormLabel>
                    <FormInput
                      placeholder={t("form.subjectPlaceholder")}
                      className="h-12 bg-card/30 backdrop-blur-sm focus:bg-card/50"
                      error={!!form.formState.errors.subject}
                      {...form.register("subject")}
                    />
                    {form.formState.errors.subject && (
                      <FormHelperText error>
                        {form.formState.errors.subject.message}
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel className="flex items-center text-base font-medium">
                      <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                      {t("form.message")}
                    </FormLabel>
                    <Textarea
                      placeholder={t("form.messagePlaceholder")}
                      className="min-h-44 resize-none bg-card/30 backdrop-blur-sm focus:bg-card/50"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <FormHelperText error>
                        {form.formState.errors.message.message}
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 text-base font-medium"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t("form.send")}
                      </>
                    )}
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
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
        </div>
      </div>
    </div>
  );
};

export default Contact;

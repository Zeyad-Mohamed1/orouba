"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/shared/PageHeader";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactDetailPage() {
  const t = useTranslations("dashboard.ContactDetail");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contact/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/en/dashboard/contacts");
          return;
        }
        throw new Error("Failed to fetch contact");
      }

      const data = await response.json();
      setContact(data.contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(t("confirmDelete"))) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete contact");
        }

        toast.success(t("deleteSuccess"));
        router.push("/en/dashboard/contacts");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error(t("deleteError"));
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground">{t("notFound")}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/en/dashboard/contacts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToList")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title={t("contactDetails")}
        buttonLabel={t("backToList")}
        buttonHref="/dashboard/contacts"
        buttonIcon="back"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{contact.subject}</CardTitle>
          <CardDescription>
            {t("submittedOn", {
              date: format(new Date(contact.createdAt), "PPP"),
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("name")}
              </h3>
              <p className="text-lg">{contact.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("email")}
              </h3>
              <p className="text-lg">{contact.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("phone")}
              </h3>
              <p className="text-lg">{contact.phone}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("submissionDate")}
              </h3>
              <p className="text-lg">
                {format(new Date(contact.createdAt), "PPP p")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t("message")}
            </h3>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex justify-between">
          <p className="text-sm text-muted-foreground">
            {t("contactId")}: {contact.id}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

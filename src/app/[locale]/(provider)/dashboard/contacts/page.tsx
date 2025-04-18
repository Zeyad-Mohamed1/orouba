"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const { locale } = useParams();
  const t = useTranslations("dashboard.Contacts");
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    router.push(`/${locale}/dashboard/contacts/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("confirmDelete"))) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete contact");
        }

        toast.success(t("deleteSuccess"));
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error(t("deleteError"));
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground">{t("noContacts")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.phone")}</TableHead>
                <TableHead>{t("table.subject")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="w-[80px]">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[200px]">
                      {contact.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(contact.createdAt), "PPP")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("table.openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("table.actions")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleView(contact.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("table.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(contact.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("table.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

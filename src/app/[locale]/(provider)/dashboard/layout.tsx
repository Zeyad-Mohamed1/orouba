"use client";

import { useSession, signOut } from "next-auth/react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/shared/Sidebar";
import { UserCircle, BellRing, Search, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "../../../../lib/utils";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRtl, setIsRtl] = useState(false);
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  useEffect(() => {
    setIsRtl(locale === "ar");
  }, [locale]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-800">
                Orouba Admin
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    isRtl ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`block w-64 ${
                    isRtl ? "pr-10 pl-3" : "pl-10 pr-3"
                  } py-2 rounded-md text-sm border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Search..."
                />
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <BellRing size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name}
                </span>
                <div className="relative group">
                  <button className="flex items-center">
                    <UserCircle size={24} className="text-gray-700" />
                  </button>
                  <div
                    className={`absolute ${
                      isRtl ? "left-0" : "right-0"
                    } mt-2 w-48 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out z-50`}
                  >
                    <button
                      onClick={() =>
                        signOut({ callbackUrl: `/${locale}/auth/signin` })
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`${isRtl ? "mr-64" : "ml-64"} pt-16`}>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Printer, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface ContactInfo {
  icon: typeof MapPin;
  text: string;
  href?: string;
}

const Footer = () => {
  const footerLinks = {
    brands: [
      { name: "Basma", path: "/brands/basma" },
      { name: "Farida", path: "/brands/farida" },
      { name: "Bap Bites", path: "/brands/bap-bites" },
    ],
    quickLinks: [
      { name: "About Us", path: "/about" },
      { name: "Our Products", path: "/products" },
      { name: "Recipes", path: "/recipes" },
    ],
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      text: "Obour city, Block 12008, section 5, Cairo, P.O.Box : El Obour 42, El Obour City, Egypt.",
    },
    { icon: Phone, text: "202 44890220", href: "tel:20244890220" },
    { icon: Printer, text: "202 44890227" },
    {
      icon: Mail,
      text: "oroubamail@orouba.agion.com",
      href: "mailto:oroubamail@orouba.agion.com",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <footer className="bg-[#003B7E] text-white relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#003B7E] to-[#002a5c]" />
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay" />

      <div className="relative">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12"
          >
            {/* Logo Section */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-3 flex items-start"
            >
              <Link href="/" className="block relative group">
                <Image
                  src="/logo.png"
                  alt="Orouba Logo"
                  width={120}
                  height={40}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>

            {/* Brands Section */}
            <motion.div variants={fadeInUp} className="md:col-span-3">
              <h3 className="text-[#FFD700] font-bold text-lg mb-4 relative inline-block">
                OUR BRANDS
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FFD700]" />
              </h3>
              <ul className="space-y-3">
                {footerLinks.brands.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={fadeInUp}
                    className="transform transition-transform duration-300 hover:translate-x-2"
                  >
                    <Link
                      href={link.path}
                      className="hover:text-[#FFD700] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] group-hover:scale-150 transition-transform" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-2">
              <h3 className="text-[#FFD700] font-bold text-lg mb-4 relative inline-block">
                QUICK LINKS
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FFD700]" />
              </h3>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={fadeInUp}
                    className="transform transition-transform duration-300 hover:translate-x-2"
                  >
                    <Link
                      href={link.path}
                      className="hover:text-[#FFD700] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] group-hover:scale-150 transition-transform" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={fadeInUp} className="md:col-span-4">
              <h3 className="text-[#FFD700] font-bold text-lg mb-4 relative inline-block">
                CONTACT US
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FFD700]" />
              </h3>
              <div className="space-y-3">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors"
                  >
                    <info.icon className="w-5 h-5 shrink-0 text-[#FFD700] group-hover:scale-110 transition-transform mt-1" />
                    {info.href ? (
                      <Link
                        href={info.href}
                        className="text-sm hover:text-[#FFD700] transition-colors"
                      >
                        {info.text}
                      </Link>
                    ) : (
                      <span className="text-sm">{info.text}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="border-t border-white/10 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <p>
                Copyright © 2024{" "}
                <span className="text-[#00D1FF] font-medium">Orouba</span>
              </p>
              <div className="flex items-center gap-6 text-white/70">
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
                <span>All rights reserved</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

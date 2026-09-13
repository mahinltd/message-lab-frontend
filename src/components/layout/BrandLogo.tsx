import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "h-9 w-9" }: BrandLogoProps) {
  return (
    <Image
      src="/branding/MessageLab-logo.png"
      alt="MessageLab"
      width={96}
      height={96}
      className={`object-contain ${className}`}
    />
  );
}
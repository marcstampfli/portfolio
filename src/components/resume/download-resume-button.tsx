"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { Experience } from "@/types/prisma";
import { pdf } from "@react-pdf/renderer";
import { Resume } from "./resume-generator";

interface DownloadResumeButtonProps {
  experiences: Experience[];
}

export function DownloadResumeButton({
  experiences,
}: DownloadResumeButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      console.log("Starting PDF generation...");

      console.log("Creating PDF instance...");
      const instance = pdf(
        <Resume experiences={experiences} fontBuffer={null} />,
      );

      console.log("PDF instance created, generating blob...");
      const blob = await instance.toBlob();
      console.log("PDF blob generated successfully");

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Marc_Stampfli_Resume_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("PDF download completed successfully");
    } catch (error) {
      console.error("PDF Generation Error:", {
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : "Unknown error",
        experiencesCount: experiences.length,
        environment: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      });
      // Show error to user
      alert(
        "Failed to generate PDF. Please try again or contact support if the issue persists.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <Button variant="outline" size="lg" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Generating PDF..." : "Download Resume"}
    </Button>
  );
}

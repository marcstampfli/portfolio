"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { Experience } from "@/types";
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
      const instance = pdf(<Resume experiences={experiences} />);
      const blob = await instance.toBlob();

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Marc_Stampfli_Resume_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Show error to user in development
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("PDF Generation Error:", error);
      }
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

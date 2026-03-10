"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { Experience } from "@/types";

interface DownloadResumeButtonProps {
  experiences: Experience[];
}

export function DownloadResumeButton({ experiences }: DownloadResumeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const [{ pdf }, { Resume }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./resume-generator"),
      ]);

      const instance = pdf(<Resume experiences={experiences} />);
      const blob = await instance.toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Marc_Stampfli_Resume_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("PDF Generation Error:", error);
      }
      alert("Failed to generate PDF. Please try again or contact support if the issue persists.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Generating PDF..." : "Download Resume"}
    </Button>
  );
}

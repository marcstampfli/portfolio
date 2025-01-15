"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { type Experience } from "@prisma/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Resume } from "./resume-generator";

interface DownloadResumeButtonProps {
  experiences: Experience[];
}

export function DownloadResumeButton({
  experiences,
}: DownloadResumeButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" size="lg" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<Resume experiences={experiences} />}
      fileName="Marc_Stampfli_Resume.pdf"
    >
      {
        (({ loading }: { loading: boolean }) => (
          <Button variant="outline" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Resume
          </Button>
        )) as unknown as React.ReactNode
      }
    </PDFDownloadLink>
  );
}

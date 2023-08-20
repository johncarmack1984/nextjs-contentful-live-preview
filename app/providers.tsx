"use client";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import { ReactNode } from "react";

export function Providers({
  children,
  isEnabled,
}: {
  children: ReactNode;
  isEnabled: boolean;
}) {
  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={true || isEnabled}
      enableLiveUpdates={true || isEnabled}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
}

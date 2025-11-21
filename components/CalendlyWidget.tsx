"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly: any;
  }
}

interface CalendlyWidgetProps {
  url: string;
  styles?: React.CSSProperties;
}

export function CalendlyWidget({ url, styles = {} }: CalendlyWidgetProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    head?.appendChild(script);

    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    head?.appendChild(link);

    return () => {
      head?.removeChild(script);
      head?.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (divRef.current && window.Calendly) {
      window.Calendly.initInlineWidget({
        url,
        parentElement: divRef.current,
        prefill: {},
        utm: {},
      });
    }
  }, [url]);

  return <div ref={divRef} style={{ minHeight: "600px", ...styles }} />;
}
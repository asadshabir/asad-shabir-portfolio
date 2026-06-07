import { useCallback } from "react";
import { trackEvent, type EventType } from "@/lib/analyticsService";

interface UseAnalyticsReturn {
  trackDownload: () => void;
  trackContact: () => void;
  trackChatbot: () => void;
  trackCTA: (label: string, page?: string) => void;
  trackEstimator: (complexity?: string) => void;
  trackReviewer: () => void;
  trackEmailCapture: () => void;
  trackBlogView: (slug: string) => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const trackDownload = useCallback(() => {
    trackEvent("resume_download");
  }, []);

  const trackContact = useCallback(() => {
    trackEvent("contact_submission");
  }, []);

  const trackChatbot = useCallback(() => {
    trackEvent("chatbot_session");
  }, []);

  const trackCTA = useCallback((label: string, page?: string) => {
    trackEvent("cta_click", {
      metadata: {
        cta_label: label,
        ...(page ? { page } : {}),
      },
    });
  }, []);

  const trackEstimator = useCallback((complexity?: string) => {
    trackEvent("estimator_use", {
      metadata: complexity ? { complexity } : undefined,
    });
  }, []);

  const trackReviewer = useCallback(() => {
    trackEvent("reviewer_use");
  }, []);

  const trackEmailCapture = useCallback(() => {
    trackEvent("email_capture");
  }, []);

  const trackBlogView = useCallback((slug: string) => {
    trackEvent("blog_view", {
      metadata: { slug },
    });
  }, []);

  return {
    trackDownload,
    trackContact,
    trackChatbot,
    trackCTA,
    trackEstimator,
    trackReviewer,
    trackEmailCapture,
    trackBlogView,
  };
}

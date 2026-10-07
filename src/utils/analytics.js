/**
 * Analytics Utility - Google Analytics 4 (gtag.js)
 * Clean, lightweight, production-safe GA4 integration for cinematic portfolio.
 * Centralizes all tracking and strictly avoids PII and noisy logs in production.
 */

export const GA_MEASUREMENT_ID = 'G-7D1LH2MH9D';

// Internal session tracking sets for deduplication
const viewedSections = new Set();
const viewedProjects = new Set();
const firedScrollDepths = new Set();
let lastTrackedPath = null;
let lastTrackedTimestamp = 0;

/**
 * Initialize GA4 asynchronously and idempotently
 */
export function initGA(measurementId = GA_MEASUREMENT_ID) {
  if (typeof window === 'undefined') return;
  if (window.__gaInitialized) return;
  window.__gaInitialized = true;

  try {
    // 1. Setup dataLayer & gtag shim
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    // 2. Queue initialization timestamps & config
    gtag('js', new Date());
    // Disable automatic page_view to allow deliberate SPA route tracking without duplicates
    gtag('config', measurementId, {
      send_page_view: false,
    });

    // 3. Inject gtag.js asynchronously without blocking initial render or altering index.html
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
  } catch {
    // Silently handle any initialization failure
  }
}

/**
 * Safe generic event tracking
 */
export function trackEvent(eventName, parameters = {}) {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }

    // Sanitize parameters: only allow controlled primitive types, strictly no PII
    const safeParams = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safeParams[key] = value;
      }
    }

    window.gtag('event', eventName, safeParams);
  } catch {
    // Analytics failures must never break the application
  }
}

/**
 * SPA Page View tracking with StrictMode deduplication
 */
export function trackPageView(pagePath, pageTitle) {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }

    const currentPath = pagePath || window.location.pathname;
    const now = Date.now();

    // Prevent duplicate triggers within 300ms for same path (e.g. React StrictMode mount cycles)
    if (lastTrackedPath === currentPath && now - lastTrackedTimestamp < 300) {
      return;
    }

    lastTrackedPath = currentPath;
    lastTrackedTimestamp = now;

    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
      page_location: typeof window !== 'undefined' ? window.location.href : '',
    });
  } catch {
    // Silently ignore
  }
}

/**
 * Section view engagement (once per section per session/view)
 */
export function trackSectionView(sectionName) {
  if (!sectionName) return;
  if (viewedSections.has(sectionName)) return;
  viewedSections.add(sectionName);

  trackEvent('section_view', {
    section_name: sectionName,
  });
}

/**
 * Project view engagement (once per project per session/view)
 */
export function trackProjectView(projectName) {
  if (!projectName) return;
  if (viewedProjects.has(projectName)) return;
  viewedProjects.add(projectName);

  trackEvent('project_view', {
    project_name: projectName,
  });
}

/**
 * Project outbound or interaction click
 */
export function trackProjectClick(projectName, destination) {
  trackEvent('project_click', {
    project_name: projectName,
    destination: destination || 'other',
  });
}

/**
 * Social / Professional clicks
 */
export function trackGithubClick(location = 'contact') {
  trackEvent('github_click', {
    location,
  });
}

export function trackLinkedinClick(location = 'contact') {
  trackEvent('linkedin_click', {
    location,
  });
}

/**
 * Resume click (available if resume button exists in the future)
 */
export function trackResumeClick(location = 'unknown') {
  trackEvent('resume_click', {
    location,
  });
}

/**
 * Contact click
 */
export function trackContactClick(contactMethod, location = 'contact') {
  trackEvent('contact_click', {
    contact_method: contactMethod,
    location,
  });
}

/**
 * Email click
 */
export function trackEmailClick(location = 'contact') {
  trackEvent('email_click', {
    location,
  });
}

/**
 * Hero Portrait open
 */
export function trackPortraitOpen() {
  trackEvent('portrait_open', {});
}

/**
 * Hero Explore CTA click
 */
export function trackExploreClick() {
  trackEvent('explore_click', {});
}

/**
 * Milestone scroll depth (25, 50, 75, 90, 100 percent)
 */
export function trackScrollDepth(percent) {
  const milestone = Number(percent);
  if (![25, 50, 75, 90, 100].includes(milestone)) return;
  if (firedScrollDepths.has(milestone)) return;
  firedScrollDepths.add(milestone);

  trackEvent('scroll_depth', {
    percent: milestone,
  });
}

/**
 * Reset scroll depth milestones on route change
 */
export function resetScrollDepthMilestones() {
  firedScrollDepths.clear();
}

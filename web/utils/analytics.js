// Analytics tracking - using Google Analytics via lib/analytics.js
// This file is kept for backward compatibility

import { trackEvent as libTrackEvent } from '../lib/analytics';

export function trackEvent(name, payload = {}) {
  // Use the centralized analytics library
  libTrackEvent(name, payload);
}

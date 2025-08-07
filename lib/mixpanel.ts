



import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with token
const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

if (typeof window !== 'undefined' && mixpanelToken) {
    mixpanel.init(mixpanelToken, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: false, // Disable automatic page tracking to avoid duplicates
        persistence: 'cookie',
        api_host: 'https://api.mixpanel.com',
    });
}

// Utility functions for tracking
export const trackEvent = (eventName: string, properties = {}) => {
    if (typeof window !== 'undefined' && mixpanelToken) {
        mixpanel.track(eventName, properties);
    }
};

export const identifyUser = (userId: string, traits = {}) => {
    if (typeof window !== 'undefined' && mixpanelToken) {
        mixpanel.identify(userId);
        if (Object.keys(traits).length > 0) {
            mixpanel.people.set(traits);
        }
    }
};

export const trackPageView = (pageName: string) => {
    if (typeof window !== 'undefined' && mixpanelToken) {
        mixpanel.track('Page View', { page: pageName });
    }
};

export const resetMixpanel = () => {
    if (typeof window !== 'undefined' && mixpanelToken) {
        mixpanel.reset();
    }
};

export default mixpanel;
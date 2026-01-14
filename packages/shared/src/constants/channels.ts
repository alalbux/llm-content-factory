export const CHANNELS = ["blog", "email", "social", "ads"] as const;

export type Channel = (typeof CHANNELS)[number];

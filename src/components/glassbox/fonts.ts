import { Crimson_Pro, Instrument_Sans } from "next/font/google";

// Type system from Kathryn's Figma mock (Hackathon / iPhone 17 - 2):
// Crimson Pro for display + values, Instrument Sans for labels/UI.
// GT Pressura (wordmark) isn't freely licensed; letterspaced Instrument
// Sans stands in.

export const crimson = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

export const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const glassboxFonts = `${crimson.variable} ${instrument.variable}`;

import React from "react";
import Image from "next/image";

interface BannerProps {
  eventType: "XMAS" | "NYE" | null;
}

import Logo from "@/components/banner.webp";

export const Banner: React.FC<BannerProps> = ({ eventType }) => {
  const getBannerText = (): string => {
    if (eventType === "XMAS") {
      return `CHRISTMAS COLLECTION
Pre-order Your Christmas Seafood Feast! Orders now being taken for December 23rd and 24th.

As this is our busiest time of the year, please note that there will be no specific delivery times. We’ll ensure your order arrives fresh and ready to enjoy!

Let us help make your Christmas even more special with the finest seafood.`;
    } else if (eventType === "NYE") {
      return `NEW YEAR COLLECTION
Celebrate the New Year with our premium seafood collection! Pre-orders now being taken for December 30th and 31st.

Ring in the New Year with the freshest seafood to make your celebration unforgettable!`;
    }
    return `CHRISTMAS COLLECTION
    Pre-order Your Christmas Seafood Feast! Orders now being taken for December 23rd and 24th.
    
    As this is our busiest time of the year, please note that there will be no specific delivery times. We’ll ensure your order arrives fresh and ready to enjoy!
    
    Let us help make your Christmas even more special with the finest seafood.`;
  };

  const getFormattedText = (text: string): JSX.Element => {
    // Regular expression to match important dates or sections like "December 23rd and 24th"
    const importantFields = /(December \d{1,2}(?:st|nd|rd|th)?)/g;

    // Split the text into parts and add bold styling to important fields
    const parts = text.split(importantFields);

    return (
      <>
        {parts.map((part, index) => {
          return importantFields.test(part) ? (
            <span key={index} className="font-bold">{part}</span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </>
    );
  };

  return (
    <div className="relative w-full h-96">
      <Image
        src={Logo}
        alt="Event Banner"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <p className="text-white text-center text-lg sm:text-2xl px-4 leading-relaxed">
          <span className="text-xl sm:text-3xl font-bold">{eventType === "XMAS" ? "CHRISTMAS COLLECTION" : "NEW YEAR COLLECTION"}</span>
          <br />
          {getFormattedText(getBannerText())}
        </p>
      </div>
    </div>
  );
};

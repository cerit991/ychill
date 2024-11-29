"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const images = [
  {
    url: "https://raw.githubusercontent.com/YouChillLounge/YouChill/refs/heads/main/image/449873964_1182976446274682_4708961029805126095_n.jpg",
    alt: "You Chill Lounge İç Mekan"
  },
  {
    url: "https://raw.githubusercontent.com/YouChillLounge/YouChill/refs/heads/main/image/449661479_3751841535137097_8714058711109211875_n.jpg",
    alt: "You Chill Lounge Yemekler"
  },
  {
    url: "https://raw.githubusercontent.com/YouChillLounge/YouChill/refs/heads/main/image/448120374_1642322163230670_4832738848555782083_n.jpg",
    alt: "You Chill Lounge Atmosfer"
  },
  {
    url: "https://raw.githubusercontent.com/YouChillLounge/YouChill/refs/heads/main/image/448339191_17912078501953261_7876319712310921887_n.jpg",
    alt: "You Chill Lounge İçecekler"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.url}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 
                   (max-width: 768px) 100vw, 
                   (max-width: 1024px) 100vw, 
                   (max-width: 1280px) 100vw, 
                   100vw"
            quality={90}
            className="object-cover brightness-50"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white space-y-4 sm:space-y-6 p-4 max-w-[90%] md:max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            You Chill Lounge
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            You Chill Lounge, Eşsiz lezzetler ve unutulmaz anılar için sizi restoranımıza bekliyoruz.
          </p>
          <Link href="/reservation">
            <Button size="lg" className="mt-4">
              Rezervasyon Yap
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
"use client"
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button } from './ui/button';
import heroImg1 from "../images/banner/Bannière.jpg";
import heroImg2 from "../images/banner/Gemini_Generated_Image_r0eyczr0eyczr0ey.png";
import heroImg3 from "../images/banner/Avène 1.png";
import heroImg4 from "../images/banner/Gemini_Generated_Image_5dxejp5dxejp5dxe.png";
import heroImg5 from "../images/banner/CeraVe.png";
import heroImg6 from "../images/banner/Gemini_Generated_Image_ke17axke17axke17.png";
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];

const HomeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Fonctions pour les boutons
  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="relative">
      <Image
        src={images[currentIndex]}
        alt="Hero"
        className="w-400 object-cover transition-all duration-700"
      />

      {/* Boutons gauche/droite */}
      <Button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-shop_light_green  text-white p-3 rounded-full hover:bg-opacity-70 transition"
      >
        <ChevronLeft  />
      </Button>
      <Button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-shop_light_green  text-white p-3 rounded-full hover:bg-opacity-70 transition"
      >
        <ChevronRight />
      </Button>

      {/* Petits points en bas */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-2">
        {images.map((_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentIndex === index
                ? "bg-white scale-110"
                : "bg-gray-400 hover:bg-gray-200"
            }`}
          ></Button>
        ))}
      </div>
    </section>
  );
};

export default HomeBanner;

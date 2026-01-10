import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeLeft, fadeRight, stagger } from '@/animations/motion';

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: './2.jpg',
      title: 'Naija Climate walk',
    },
    {
      url: './3.jpg',
      title: 'Youth Climate Summit',
    },
    {
      url: './4.jpg',
      title: 'Climate Leadership Program',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section id="gallery" className="bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Gallery</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            A glimpse into our operations, services, and the impact we're making across Nigeria
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Image Container */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96 md:h-[500px]">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0'
                    : index < currentIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h4 className="text-2xl md:text-3xl font-bold text-white">{image.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all cursor-pointer z-10"
            aria-label="Previous slide"
          >
            <i className="ri-arrow-left-s-line text-2xl text-gray-900"></i>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all cursor-pointer z-10"
            aria-label="Next slide"
          >
            <i className="ri-arrow-right-s-line text-2xl text-gray-900"></i>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all cursor-pointer ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-blue-600 rounded-full'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
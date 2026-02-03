import React, { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import arrowRight from "../../../assets/icons/arrow-right.svg";
import arrowLeft from "../../../assets/icons/arrow-left.svg";
import { stagesMock } from "../../../shared/utils/mock";

const DetailsCarousel = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const handlePrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width >= 1200) return setVisibleItems(4);
      if (width >= 900) return setVisibleItems(3);
      if (width >= 600) return setVisibleItems(2);
      setVisibleItems(1);
    };
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const handleNext = () => {
    if (carouselIndex < stagesMock.length - visibleItems) {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  // Render each stat card in the carousel
  const renderStatCard = (stat: (typeof stagesMock)[number]) => (
    <div className="w-full h-full py-4 px-2" key={stat.id}>
      <div
        style={{ backgroundColor: stat.color }}
        className="h-full rounded-md flex flex-col justify-between px-10 py-6"
      >
        <h2 className="text-lg font-normal">{stat.title}</h2>
        <p className="text-2xl font-bold">{stat.value}</p>
      </div>
    </div>
  );

  return (
    <div className="relative mx-1">
      <button
        type="button"
        onClick={handlePrev}
        disabled={carouselIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow bg-white ${
          carouselIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <img src={arrowLeft} className="w-5 h-5" alt="Previous" />
      </button>

      <Carousel
        value={stagesMock}
        itemTemplate={renderStatCard}
        numVisible={visibleItems}
        numScroll={1}
        circular={false}
        autoplayInterval={0}
        showIndicators={false}
        showNavigators={false}
        page={carouselIndex}
        onPageChange={(e) => setCarouselIndex(e.page)}
      />

      <button
        type="button"
        onClick={handleNext}
        disabled={carouselIndex >= stagesMock.length - visibleItems}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow bg-white ${
          carouselIndex >= stagesMock.length - visibleItems
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <img src={arrowRight} className="w-5 h-5" alt="Next" />
      </button>
    </div>
  );
};

export default DetailsCarousel;

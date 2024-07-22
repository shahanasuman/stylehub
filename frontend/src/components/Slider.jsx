import React from 'react';
import SimpleImageSlider from "react-simple-image-slider";
import "./Slider.css";

const images = [
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-UberHP-PromoWidget24-Desk-Banner1-13Mar24.jpg" },
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-UberHP-PromoWidget24-Desk-Banner2-13Mar24.jpg" },
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-Uber-HP-Desktop-HeroBanner1-15Apr2024.gif" },
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-UberHP-PromoWidget48-Desk-Banner1-12Apr24.jpg" },
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-UberHP-Promowidget26-Desk-Banner2-16Apr24.jpg" },
  { url: "https://cms.landmarkshops.in/cdn-cgi/image/w=1232,q=70,fit=cover/LS-Fest/LS-new/LS-UberHP-PromoWidget50-Desk-Banner1-10Apr24.jpg" },
];

const Slider = () => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sliderWidth = windowWidth < 768 ? windowWidth : 1473;
  const sliderHeight = windowWidth < 768 ? windowWidth * 0.3 : 500;

  return (
    <div className="ss">
      <div className="slider-container">
        <SimpleImageSlider
          width={sliderWidth}
          height={sliderHeight}
          images={images}
          showBullets={true}
          showNavs={true}
        />
      </div>
    </div>
  );
}

export default Slider;

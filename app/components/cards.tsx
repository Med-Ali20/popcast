'use client';

import React, { useState, useRef, useEffect } from "react";
import { Slide } from "react-awesome-reveal";

interface FlipImageProps {
  decade: string;
  className?: string;
}

const FlipImage: React.FC<FlipImageProps> = ({ decade, className }) => {
  const [currentImage, setCurrentImage] = useState(1);
  const [nextImage, setNextImage] = useState(2);
  const [isFlipping, setIsFlipping] = useState(false);
  const [frontSide, setFrontSide] = useState(true);
  const [backSide, setBackSide] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsFlipping(!isFlipping);
      setFrontSide(!frontSide);
      setBackSide(!backSide);
    }, 5000);
  }, [isFlipping]);

  return (
    <div className={`${className} perspective-1000`}>
      <div
        className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${
          isFlipping ? "rotate-y-180" : ""
        }`}
        style={{
          transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onTransitionEnd={() => {
          backSide
            ? setCurrentImage((nextImage % 5) + 1)
            : setNextImage((currentImage % 5) + 1);
        }}
      >
        {/* Front side */}
        <img
          src={`/images/${decade}/0${currentImage}.png`}
          alt={`${decade} front`}
          className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden] rounded-full"
        />

        {/* Back side */}
        <img
          src={`/images/${decade}/0${nextImage}.png`}
          alt={`${decade} back`}
          className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden] rotate-y-180 rounded-full"
        />
      </div>
    </div>
  );
};

const ImageCards = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  const cards = [
    {
      decade: "1980s",
      title: "1980s",
      description:
        "في الثمانينات بدآت ملامح البوب العربي بالظهور بعيدًا عن سيطرة الطرب الكلاسيكي. كانت فترة تجريبية جريئة حاول فيها الفنانون إدخال الإيقاعات الخفيفة والتوزيعات الغربية مع الهوية العربية. لم يكن الانتشار واسعًا بعد، لكنه كان الشرارة",
    },
    {
      decade: "1990s",
      title: "1990s",
      description:
        "التسعينات متّلت الانطلاقة الذهبية للبوب العربي. مع انتشار الأشرطة والأقراص المدمجة، وظهور الفيديو كليب كأداة تسويقية اساسية على القنوات العامة والمهرجانات الموسيقية، تحوّل النجوم إلى رموز جماهيرية. هذا العقد كان مرحلة التاسيس لثقافة البوب الحديثة، حيث اجتمع الصوت مع الصورة لأول مرة بشكل واسع النطاق.",
    },
    {
      decade: "2000s",
      title: "2000s",
      description:
        "الألفينات شهدت الانفجار الكبير لع صعود القنوات الفضائية لمتخصصة مثل روتانا، ميلودي، ومازيكا. الألبومات والإنتاجات البصرية وصلت إلى ذروتها، واصبحت المنافسة بين النجوم مشتعلة على مدار الساعة. هذه حقبة قدّمت النضج الفني التجريب البصري، ورسّخت الصورة الحديثة للبوب العربي في لذاكرة الجماعية.",
    },
    {
      decade: "2010s",
      title: "2010s - 2020s",
      description:
        "في هذا العقد برزت التحديات: اضطرابات سياسية آثرت على الإنتاج، وتراجع الدعم المالي، وعدم مواكبة سريعة للتحولات الرقمية. رغم ذلك، ظل نجوم التسعينات والألفينات مسيطرين، بينما واجه الجيل جديد صعوبة في ترسيخ مكانته. كانت مرحلة انتقالية شفت هشاشة الصناعة آمام ثورة البث عبر الإنترنت والمنصات الحديثة.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // @ts-ignore
            const cardIndex = parseInt(entry.target?.dataset?.cardIndex);
            setVisibleCards((prev) => new Set([...prev, cardIndex]));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 overflow-hidden md:hidden gap-15 p-6 pt-12 max-w-6xl mx-auto">
      {cards.map((card, index) => (
        <Slide key={index} direction="up" triggerOnce delay={index * 200}>
          <div
            // @ts-ignore
            ref={(el) => (cardRefs.current[index] = el)}
            data-card-index={index}
            className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Card Content */}
            <div className="relative z-10 pr-8 mr-5" dir="rtl">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 font-emirates">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-emirates">
                {card.description}
              </p>
            </div>

            {/* Circular Image Container in Corner Cutout */}
            <div className="absolute -top-[15%] -right-[5%] w-[90px] rounded-full h-[90px] bg-primary md:w-24 md:h-24 flex items-center justify-center">
              <div className="w-20 h-20 md:w-20 md:h-20 rounded-full z-50 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <FlipImage
                  decade={card.decade}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Slide>
      ))}
    </div>
  );
};

export default ImageCards;
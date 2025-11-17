"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import { Zoom } from "react-awesome-reveal";
import dynamic from "next/dynamic";

// Lazy load ImageCards
const ImageCards = dynamic(() => import("../../components/cards"), {
  loading: () => <div className="h-40" />,
});

interface FlipImageProps {
  decade: string;
  className: string;
}

// Memoized FlipImage component
const FlipImage = memo<FlipImageProps>(({ decade, className }) => {
  const [currentImage, setCurrentImage] = useState(1);
  const [nextImage, setNextImage] = useState(2);
  const [isFlipping, setIsFlipping] = useState(false);
  const [frontSide, setFrontSide] = useState(true);
  const [backSide, setBackSide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipping(!isFlipping);
      setFrontSide(!frontSide);
      setBackSide(!backSide);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isFlipping, frontSide, backSide]);

  const handleTransitionEnd = useCallback(() => {
    if (backSide) {
      setCurrentImage((nextImage % 5) + 1);
    } else {
      setNextImage((currentImage % 5) + 1);
    }
  }, [backSide, nextImage, currentImage]);

  return (
    <div className={`${className} perspective-1000`}>
      <div
        className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d]`}
        style={{
          transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <img
          src={`/images/${decade}/0${currentImage}.png`}
          alt={`${decade} front`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden] rounded-2xl"
        />

        <img
          src={`/images/${decade}/0${nextImage}.png`}
          alt={`${decade} back`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden] rotate-y-180 rounded-2xl"
        />
      </div>
    </div>
  );
});
FlipImage.displayName = "FlipImage";

const History = () => {
  return (
    <section className="overflow-x-hidden">
      <h2 className="text-white mx-auto text-center text-xl lg:text-4xl font-emirates lg:pt-5 font-bold w-fit my-5">
        تاريخ البوب العربي
      </h2>
      <div className="text-white font-emirates hidden md:flex relative mt-8 h-[20vw]">
        <div className="flex flex-col items-center absolute left-[3vw] top-[17vw] lg:top-[20vw]">
          <h3 className="text-center text-[2.5vw] my-4 font-bold">
            2010s–2020s
          </h3>
          <p dir="rtl" className="max-w-[20vw] text-[1.05vw] text-center">
            في هذا العقد برزت التحديات: اضطرابات سياسية آثرت على الإنتاج، وتراجع
            الدعم المالي، وعدم مواكبة سريعة للتحولات الرقمية. رغم ذلك، ظل نجوم
            التسعينات والألفينات مسيطرين، بينما واجه الجيل الجديد صعوبة في ترسيخ
            مكانته. كانت مرحلة انتقالية كشفت هشاشة الصناعة أمام ثورة البث عبر
            الإنترنت والمنصات الحديثة.
          </p>
        </div>

        <div className="flex flex-col items-center absolute left-[27vw] top-[1vw] lg:top-[4vw]">
          <h3 className="text-center text-[2.5vw] my-4 font-bold">2000s</h3>
          <p dir="rtl" className="max-w-[20vw] text-[1.05vw] text-center">
            الألفينات شهدت الانفجار الكبير لصعود القنوات الفضائية المتخصصة مثل
            روتانا، ميلودي، ومازيكا. الألبومات والإنتاجات البصرية وصلت إلى
            ذروتها، واصبحت المنافسة بين النجوم مشتعلة على مدار الساعة. هذه حقبة
            قدّمت النضج الفني والتجريب البصري، ورسّخت الصورة الحديثة للبوب
            العربي في الذاكرة الجماعية.
          </p>
        </div>

        <div className="flex flex-col items-center absolute right-[27vw] top-[1vw] lg:top-[4vw]">
          <h3 className="text-center text-[2.5vw] my-4 font-bold">1990s</h3>
          <p dir="rtl" className="max-w-[20vw] text-[1.05vw] text-center">
            التسعينات مثّلت الانطلاقة الذهبية للبوب العربي. مع انتشار الأشرطة
            والأقراص المدمجة، وظهور الفيديو كليب كأداة تسويقية أساسية على
            القنوات العامة والمهرجانات الموسيقية، تحوّل النجوم إلى رموز
            جماهيرية. هذا العقد كان مرحلة التأسيس لثقافة البوب الحديثة، حيث
            اجتمع الصوت مع الصورة لأول مرة بشكل واسع النطاق.
          </p>
        </div>

        <div className="flex flex-col items-center absolute right-[5vw] top-[17vw] lg:top-[20vw]">
          <h3 className="text-center text-[2.5vw] my-4 font-bold">1980s</h3>
          <p dir="rtl" className="max-w-[15vw] text-[1.05vw] text-center">
            في الثمانينات بدأت ملامح البوب العربي بالظهور بعيدًا عن سيطرة الطرب
            الكلاسيكي. كانت فترة تجريبية جريئة حاول فيها الفنانون إدخال
            الإيقاعات الخفيفة والتوزيعات الغربية مع الهوية العربية. لم يكن
            الانتشار واسعًا بعد، لكنه كان الشرارة الأولى.
          </p>
        </div>
      </div>

      <div className="relative hidden md:block w-full h-[40vw]">
        <img
          src="/elements/17.webp"
          alt=""
          loading="lazy"
          className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[65vw]"
        />

        <FlipImage
          decade="2010s"
          className="w-[10vw] h-[10vw] absolute top-[20vw] left-[15vw]"
        />
        <FlipImage
          decade="2000s"
          className="w-[10vw] h-[10vw] absolute top-[4vw] left-[32vw]"
        />
        <FlipImage
          decade="1990s"
          className="w-[10vw] h-[10vw] absolute top-[4vw] right-[32vw]"
        />
        <FlipImage
          decade="1980s"
          className="w-[10vw] h-[10vw] absolute top-[20vw] right-[15vw]"
        />
      </div>

      <div className="relative w-full bg-primary hidden md:block h-[15vw]">
        <img
          src="/elements/08.webp"
          alt=""
          loading="lazy"
          className="absolute w-[25vw] top-[-11vw] left-[50%] translate-x-[-50%] mb-[-7vw] z-10"
        />
        <div className="w-full h-[20%] absolute top-0 bg-primary brightness-[105%] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"></div>
      </div>

      <ImageCards />
    </section>
  );
};

export default History;
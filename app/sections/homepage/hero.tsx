"use client";

import React, { useRef, useEffect, useState } from "react";
import { Zoom, Slide, Fade, Bounce } from "react-awesome-reveal";
import { useRouter } from "next/navigation";
import "./styles.css";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [eyeAnimationActive, setEyeAnimationActive] = useState(false);
  const cardRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Trigger eye animations with a slight delay after background animation
          setTimeout(() => {
            setEyeAnimationActive(true);
          }, 300);
          // Optionally disconnect after first trigger
          observer.disconnect();
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: "0px 0px -50px 0px", // Adjust trigger point
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex items-center justify-center md:mt-[7vw] lg:mt-[5vw]">
      <div className="w-[90%] md:w-[50%] mx-auto font-emirates relative">
        {/* Background that starts at 40% height on md+ screens */}
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.4)] rounded-lg top-[4vw] md:top-[10vw] lg:top-[15vw]"></div>

        {/* Content with relative positioning and padding */}
        <div className="relative flex flex-col p-8 md:pt-0">
          {/* Images container with fixed aspect ratio */}
          <Slide direction="up" cascade triggerOnce>
            <div className="relative w-[70vw] z-20 md:w-[53vw] ml-[10%] -mr-[40%] md:-ml-[10%] lg:-ml-[7%] aspect-video min-h-[300px]">
              {/* First two images with Zoom animation */}
              <Zoom triggerOnce delay={0}>
                <img
                  src="/elements/02.png"
                  alt=""
                  className="absolute w-full top-[0] left-[40%] md:-top-[20%] md:left-1/2 -translate-x-1/2"
                />
              </Zoom>

              <Zoom triggerOnce delay={200}>
                <img
                  src="/elements/03.png"
                  alt=""
                  className="absolute w-full -top-[2%] left-[35%] md:-top-[5%] md:left-[42.857%] -translate-x-1/2"
                />
              </Zoom>

              {/* Rest of the images with Fade animation to avoid positioning issues */}
              <Slide direction="up" triggerOnce delay={400}>
                <img
                  src="/elements/06.png"
                  alt=""
                  className="absolute w-3/5 top-[5%] left-[15%] md:w-2/5 md:top-0 md:left-1/4 -translate-x-1/2"
                />
              </Slide>

              <img
                src="/elements/04.png"
                alt=""
                className="absolute w-3/5 -top-[10%] left-1/2 md:w-2/5 md:-top-[20%] md:left-1/2 -translate-x-1/2"
              />

              <img
                src="/elements/01.png"
                alt=""
                className="absolute w-4/5 top-[24%] -right-[15%] md:w-1/2 md:top-0 md:-right-[5%]"
              />

              <img
                src="/elements/07.png"
                alt=""
                className="absolute w-1/2 left-[0%] top-[40%] md:w-1/3 md:left-[5%] md:top-[30%]"
              />
              <img
                src="/elements/05.png"
                alt=""
                className="absolute w-3/5 left-[20%] top-[45%] md:w-2/5 md:left-[30%] md:top-[35%]"
              />

              <div className="absolute w-3/5 -left-[15%] md:left-[10%] top-[80%] md:w-2/5 md:left-[15%] md:top-[75%]">
                {/* --- Black background placeholder --- */}
                <div
                  className="absolute w-[70%] md:w-[67%] left-[2%] top-[22%] md:left-[2.5%] md:top-[22%] bg-black aspect-video"
                  style={{
                    transform: "rotateY(38deg) rotateX(12deg) rotateZ(8deg)",
                    clipPath: "polygon(3% 5%, 97% 3%, 98% 95%, 2% 97%)",
                    backgroundColor: "#000",
                  }}
                ></div>

                {/* --- TV container --- */}
                <div
                  className="absolute w-[70%] md:w-[67%] left-[2%] top-[22%] md:left-[2.5%] md:top-[22%] rounded-sm overflow-hidden z-10"
                  style={{
                    transform: "rotateY(38deg) rotateX(12deg) rotateZ(8deg)",
                    clipPath: "polygon(3% 5%, 97% 3%, 98% 95%, 2% 97%)",
                  }}
                >
                  {/* Video overlay */}
                  <video
                    src="/images/video.webm"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Cinematic bars (top + bottom) */}
                <div className="absolute top-[18.2%] left-[10%] w-[80%] h-[8%] bg-black rotate-[9deg] z-20"></div>
                <div className="absolute bottom-[33.7%] left-[10%] w-[80%] h-[8%] bg-black rotate-[8.5deg] z-20"></div>

                {/* TV frame image (above video) */}
                <img
                  src="/elements/09.png"
                  alt="TV"
                  className="relative z-40 pointer-events-none"
                />
              </div>

              <img
                src="/elements/08.png"
                alt=""
                className="absolute w-3/5 right-0 md:right-[-5%] top-[75%] md:w-2/5 md:right-[5%] md:top-[70%]"
              />
            </div>
          </Slide>

          {/* Text content with top padding on md+ to account for background */}
          <Fade triggerOnce>
            <div className="mt-[16vw] pt-[20%] md:pt-0">
              <p
                dir="rtl"
                className="text-justify w-full text-secondary lg:text-lg lg:leading-8 px-3"
              >
                <span className="font-bold">بـوب كاست</span> هو مساحة إبداعية
                جديدة انطلقت عام 2025 كامتداد لمشروع ArabiaPop، لكن بروح مختلفة
                وأكثر حرية. يفتح الباب للحوار والتجارب، من خلال حلقات بودكاست مع
                صناع الموسيقى والجمهور، وميني-دوكـوس تروي قصص من وراء الكواليس،
                ومقالات تحليلية تغوص في تاريخ البوب العربي. بوب كاست يعيد قراءة
                العقود الذهبية لثقافتنا الشعبية – من الثمانينات، إلى الطفرة في
                التسعينات، مرورًا بعصر القنوات الفضائية في الألفينات، وصولاً إلى
                التحديات الرقمية في العقد الأخير – ليقدّم أرشيفًا حيًّا وتجربة
                تفاعلية تربط الماضي بالحاضر.
              </p>
            </div>
          </Fade>

          <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-10 text-right text-white mt-12">
            <div
              className="group relative flex w-[100%] origin-right items-center cursor-pointer shadow-2xl rounded-2xl py-4 lg:w-[50%] mt-6 lg:mt-0 pr-4 overflow-hidden"
              onClick={() => router.push("/article")}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] rounded-2xl origin-right transform transition-transform duration-350 ease-out scale-x-[0] group-hover:scale-x-[1]"></div>

              <div className="ml-auto relative z-10">
                <h3 className="text-2xl lg:text-2xl font-bold">اقرأ</h3>
                <p className="text-lg">مقالات بوب كاست</p>
              </div>

              <img
                src="/elements/13.png"
                alt=""
                className="w-[70px] ml-5 relative z-10"
              />
            </div>

            <div
              onClick={() => router.push("/podcast")}
              className="group flex w-[100%] cursor-pointer items-center py-3 pr-4  shadow-2xl rounded-2xl lg:w-[50%] relative overflow-hidden"
            >
              {/* Hover expanding background */}
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] rounded-2xl origin-right transform transition-transform duration-350 ease-out scale-x-[0] group-hover:scale-x-[1]"></div>

              {/* Content */}
              <div className="ml-auto relative z-10">
                <h3 className="text-2xl lg:text-2xl font-bold">شاهد</h3>
                <p className="text-lg">محتوى بصري</p>
              </div>

              <div className="relative w-fit ml-5 z-10">
                <img
                  src="/elements/eye.png"
                  alt=""
                  className="w-[70px] h-[70px] object-contain relative"
                />

                {/* Pupil */}
                <span
                  className="absolute inset-0 w-[20px] h-[20px] bg-white rounded-full 
      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: eyeAnimationActive ? "float 2s" : "none",
                  }}
                ></span>

                {/* Top eyelid */}
                <span
                  className="absolute inset-0 w-[0] h-[16px] bg-white rounded-t-full 
      md:top-[42%] md:left-1/2 top-[42%] left-[25%] origin-top hidden md:block
      -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: eyeAnimationActive ? "blink 1s 2s" : "none",
                  }}
                ></span>

                {/* Bottom eyelid */}
                <span
                  className="absolute inset-0 h-[18px] w-[0] bg-white rounded-t-full 
      md:top-[86%] md:left-1/2 top-[86%] left-[25%] origin-top hidden md:block
      -translate-x-1/2 -translate-y-1/2 rotate-180"
                  style={{
                    animation: eyeAnimationActive ? "blink 1s 2s" : "none",
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

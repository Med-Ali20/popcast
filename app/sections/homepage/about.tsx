import React from "react";
import Marquee from "../../components/marquee";
import { Slide, Zoom } from "react-awesome-reveal";

const about = () => {
  return (
    <section className="bg-white text-primary gap-15 lg:gap-20 flex flex-col mt-12 px-10 py-20 font-emirates">
      <div className="flex flex-col gap-10 items-center">
        <Zoom triggerOnce className="mr-[2%]">
          <h1
            dir="rtl"
            className="text-2xl md:text-4xl border-b-2 border-b-primary  font-bold mb-6"
          >
            ما هو POP CAST
          </h1>
        </Zoom>
        <div className="flex flex-col lg:flex-row gap-15 lg:gap-10 row lg:pl-[2%] max-w-[80%] justify-center">
          <Slide direction="up" triggerOnce>
            <div className="flex flex-col items-center text-center">
              <img src="/elements/chat.png" alt="" className="w-[120px]" />
              <h2 className="my-3 text-xl md:text-4xl font-bold">مقالات تحليلية</h2>
              <p className="text-lg md:text-2xl" dir="rtl">
                قراءات عميقة تربط الماضي بالحاضر و تفكك تحولات الثقافة الشعبية.
              </p>
            </div>
            <div className="flex flex-col items-center text-center ml-4">
              <img src="/elements/film.png" alt="" className="w-[120px]" />
              <h2 className="my-3 text-xl md:text-4xl font-bold">ميني-دوكس</h2>
              <p className="text-lg md:text-2xl" dir="rtl">
                وثائقيات قصيرة تعيد إحياء لحظات و محطات بارزة من تاريخ البوب
                العربي.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src="/elements/microphone.png"
                alt=""
                className="w-[120px]"
              />
              <h2 className="my-3 text-xl md:text-4xl font-bold">لقاءات</h2>
              <p className="text-lg md:text-2xl" dir="rtl">
                حوارات تكشف كواليس الصناعة و أسرار الإبداع من داخل الوسط الفني و
                مع الجمهور.
              </p>
            </div>
          </Slide>
        </div>
      </div>
      <Marquee />
      <div
        className="flex flex-col lg:flex-row items-center justify-center w-full gap-10 md:gap-20"
        dir="rtl"
      >
        <div>
          <Zoom triggerOnce>
            <h3 className="text-lg md:text-3xl border-b-2 border-b-primary mx-auto font-bold mb-4 md:mb-10 w-fit">
              اطلع على مقالاتنا
            </h3>
          </Zoom>
          <Slide direction="up" triggerOnce>
            <a
              href="#"
              className="md:w-[30rem] md:h-[30rem] w-[15rem] h-[15rem] overflow-hidden block relative"
            >
              <img
                src="/elements/11.png"
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <h4 className="absolute bottom-[5%] text-sm md:text-lg w-full text-center text-white">
                عنوان المقال
              </h4>
            </a>
          </Slide>
        </div>
        <div>
          <Zoom triggerOnce>
            <h3 className="text-lg md:text-3xl border-b-2 border-b-primary mx-auto font-bold mb-4 md:mb-10 w-fit">
              احدث الحلقات
            </h3>
          </Zoom>
          <Slide direction="up" triggerOnce>
            <a
              href="#"
              className="md:w-[30rem] md:h-[30rem] w-[15rem] h-[15rem] overflow-hidden block relative"
            >
              <img
                src="/elements/11.png"
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <h4 className="absolute bottom-[5%] text-sm md:text-lg w-full text-center text-white">
                عنوان البودكاست
              </h4>
            </a>
          </Slide>
        </div>
      </div>
    </section>
  );
};

export default about;
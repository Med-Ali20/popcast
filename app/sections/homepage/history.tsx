import React from "react";
import { Bounce, Fade, Zoom } from "react-awesome-reveal";
import ImageCards from "../../components/cards";

const History = () => {
  return (
    <section>
      <Zoom triggerOnce>
        <h2 className="text-white mx-auto text-center text-xl lg:text-4xl font-emirates pt-10 underline underline-offset-[35%] decoration-4 decoration-secondary w-fit my-10">
          تاريخ البوب العربي
        </h2>
      </Zoom>
      <Zoom cascade className="hidden md:block" triggerOnce>
        <div className="text-white font-emirates flex relative mt-8 h-[20vw]">
          <div className="flex flex-col items-center absolute left-[3vw] top-[20vw]">
            <h3 className="text-center text-[3vw] my-4 font-bold">
              2010s- 2020s
            </h3>
            <p dir="rtl" className="max-w-[20vw] text-[1vw] text-center">
              في هذا العقد برزت التحديات: اضطرابات سياسية آثرت على الإنتاج،
              وتراجع الدعم المالي، وعدم مواكبة سريعة للتحولات الرقمية. رغم ذلك،
              ظل نجوم التسعينات والألفينات مسيطرين، بينما واجه الجيل جديد صعوبة
              في ترسيخ مكانته. كانت مرحلة انتقالية شفت هشاشة الصناعة آمام ثورة
              البث عبر الإنترنت والمنصات الحديثة.
            </p>
          </div>
          <div className="flex flex-col items-center absolute left-[27vw] top-[4vw]">
            <h3 className="text-center text-[3vw] my-4 font-bold">2000s</h3>
            <p dir="rtl" className="max-w-[20vw] text-[1vw] text-center">
              الألفينات شهدت الانفجار الكبير لع صعود القنوات الفضائية لمتخصصة
              مثل روتانا، ميلودي، ومازيكا. الألبومات والإنتاجات البصرية وصلت إلى
              ذروتها، واصبحت المنافسة بين النجوم مشتعلة على مدار الساعة. هذه
              حقبة قدّمت النضج الفني التجريب البصري، ورسّخت الصورة الحديثة للبوب
              العربي في لذاكرة الجماعية.
            </p>
          </div>
          <div className="flex flex-col items-center absolute right-[27vw] top-[4vw]">
            <h3 className="text-center text-[3vw] my-4 font-bold">1990s</h3>
            <p dir="rtl" className="max-w-[20vw] text-[1vw] text-center">
              التسعينات متّلت الانطلاقة الذهبية للبوب العربي. مع انتشار الأشرطة
              والأقراص المدمجة، وظهور الفيديو كليب كأداة تسويقية اساسية على
              القنوات العامة والمهرجانات الموسيقية، تحوّل النجوم إلى رموز
              جماهيرية. هذا العقد كان مرحلة التاسيس لثقافة البوب الحديثة، حيث
              اجتمع الصوت مع الصورة لأول مرة بشكل واسع النطاق.
            </p>
          </div>
          <div className="flex flex-col items-center absolute right-[5vw] top-[20vw]">
            <h3 className="text-center text-[3vw] my-4 font-bold">1980s</h3>
            <p dir="rtl" className="max-w-[15vw] text-[1vw] text-center">
              في الثمانينات بدآت ملامح البوب العربي بالظهور بعيدًا عن سيطرة
              الطرب الكلاسيكي. كانت فترة تجريبية جريئة حاول فيها الفنانون إدخال
              الإيقاعات الخفيفة والتوزيعات الغربية مع الهوية العربية. لم يكن
              الانتشار واسعًا بعد، لكنه كان الشرارة
            </p>
          </div>
        </div>
      </Zoom>
      <div className="relative hidden md:block w-full h-[40vw]">
        <img
          src="/elements/17.png"
          alt=""
          className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[65vw]"
        />

        <img
          src="/elements/22.png"
          alt=""
          className="w-[10vw] absolute top-[20vw] left-[15vw]"
        />
        <img
          src="/elements/21.png"
          alt=""
          className="w-[10vw] absolute top-[4vw] left-[32vw]"
        />
        <img
          src="/elements/20.png"
          alt=""
          className="w-[10vw] absolute top-[4vw] right-[32vw]"
        />
        <img
          src="/elements/19.png"
          alt=""
          className="w-[10vw] absolute top-[20vw] right-[15vw]"
        />
      </div>
      <div className="relative w-full hidden md:block h-[15vw] mb-8">
        <img
          src="/elements/08.png"
          alt=""
          className="absolute w-[25vw] top-[-11vw] left-[50%] translate-x-[-50%] mb-[-7vw] z-10 "
        />
        <div className="w-full h-[20%] absolute top-0 bg-primary brightness-[105%] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"></div>
      </div>
      <ImageCards />
    </section>
  );
};

export default History;

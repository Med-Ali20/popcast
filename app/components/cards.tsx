    'use client';

    import React, { useState, useRef, useEffect } from "react";
    import { Slide } from "react-awesome-reveal";

    const ImageCards = () => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    const cards = [
        {
        image: "/elements/19.png",
        title: "1980s",
        description: "في الثمانينات بدآت ملامح البوب العربي بالظهور بعيدًا عن سيطرة الطرب الكلاسيكي. كانت فترة تجريبية جريئة حاول فيها الفنانون إدخال الإيقاعات الخفيفة والتوزيعات الغربية مع الهوية العربية. لم يكن الانتشار واسعًا بعد، لكنه كان الشرارة"
        },
        {
        image: "/elements/20.png", 
        title: "1990s",
        description: "التسعينات متّلت الانطلاقة الذهبية للبوب العربي. مع انتشار الأشرطة والأقراص المدمجة، وظهور الفيديو كليب كأداة تسويقية اساسية على القنوات العامة والمهرجانات الموسيقية، تحوّل النجوم إلى رموز جماهيرية. هذا العقد كان مرحلة التاسيس لثقافة البوب الحديثة، حيث اجتمع الصوت مع الصورة لأول مرة بشكل واسع النطاق."
        },
        {
        image: "/elements/21.png",
        title: "2000s", 
        description: "الألفينات شهدت الانفجار الكبير لع صعود القنوات الفضائية لمتخصصة مثل روتانا، ميلودي، ومازيكا. الألبومات والإنتاجات البصرية وصلت إلى ذروتها، واصبحت المنافسة بين النجوم مشتعلة على مدار الساعة. هذه حقبة قدّمت النضج الفني التجريب البصري، ورسّخت الصورة الحديثة للبوب العربي في لذاكرة الجماعية."
        },
        {
        image: "/elements/22.png",
        title: "2010s - 2020s",
        description: "في هذا العقد برزت التحديات: اضطرابات سياسية آثرت على الإنتاج، وتراجع الدعم المالي، وعدم مواكبة سريعة للتحولات الرقمية. رغم ذلك، ظل نجوم التسعينات والألفينات مسيطرين، بينما واجه الجيل جديد صعوبة في ترسيخ مكانته. كانت مرحلة انتقالية شفت هشاشة الصناعة آمام ثورة البث عبر الإنترنت والمنصات الحديثة."
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // @ts-ignore
                const cardIndex = parseInt(entry.target?.dataset?.cardIndex);
                setVisibleCards(prev => new Set([...prev, cardIndex]));
            }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        }
        );

        cardRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="grid grid-cols-1 md:hidden gap-15 p-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
            <Slide 
            key={index} 
            direction="up" 
            triggerOnce 
            delay={index * 200}
            >
            <div 
            // @ts-ignore
                ref={(el) => cardRefs.current[index] = el}
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
                <div 
                    className={`w-20 h-20 md:w-20 md:h-20 rounded-full z-50 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center transition-transform duration-1000 ease-out ${
                    visibleCards.has(index) ? 'animate-flip' : ''
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <img
                    src={card.image}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                    />
                </div>
                </div>
            </div>
            </Slide>
        ))}
        
        <style jsx>{`
            @keyframes flip {
            0% {
                transform: rotateY(0deg);
            }
            50% {
                transform: rotateY(90deg);
            }
            100% {
                transform: rotateY(0deg);
            }
            }
            
            .animate-flip {
            animation: flip 1s ease-in-out;
            }
        `}</style>
        </div>
    );
    };

    export default ImageCards;
import Marquee from "react-fast-marquee";
import {
  Mic,
  Music,
  Disc3,
  Headphones,
  Guitar,
  Piano,
  Volume2,
  Radio,
  Drum,
  PlayCircle,
} from "lucide-react";

const MusicMarquee = () => {
  // Array of music-related icons
  const musicIcons = [
    { Icon: Mic, name: "microphone" },
    { Icon: Music, name: "music" },
    { Icon: Disc3, name: "disc" },
    { Icon: Headphones, name: "headphones" },
    { Icon: Guitar, name: "guitar" },
    { Icon: Piano, name: "piano" },
    { Icon: Volume2, name: "speaker" },
    { Icon: Radio, name: "radio" },
    { Icon: Drum, name: "drum" },
    { Icon: PlayCircle, name: "play" },
  ];

  // Create repeated icons to fill horizontal space
  const createRepeatedIcons = (repeatCount = 4) => {
    const repeatedIcons: any = [];
    for (let i = 0; i < repeatCount; i++) {
      musicIcons.forEach(({ Icon, name }, index) => {
        repeatedIcons.push(
          <div
            key={`${name}-${i}-${index}`}
            className="flex items-center justify-around mx-6 gap-10 overflow-y-hidden"
          >
            <Icon
              size={32}
              className="text-white opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-300"
            />
            {/* <span className="text-primary opacity-40 hover:opacity-100 cursor-default">●</span> */}
          </div>
        );
      });
    }
    return repeatedIcons;
  };

  return (
    <div className="w-full  py-6">
      <Marquee speed={30} gradient={false} pauseOnHover={true}>
        {createRepeatedIcons(3)}
      </Marquee>
    </div>
  );
};

export default MusicMarquee;

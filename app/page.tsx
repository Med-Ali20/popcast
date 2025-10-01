import Image from "next/image";
import Hero from "./sections/homepage/hero";
import About from "./sections/homepage/about";
import History from "./sections/homepage/history";

export default function Home() {
  return (
      <main>
        <Hero/>
        <About />
        <History />
      </main>
  );
}

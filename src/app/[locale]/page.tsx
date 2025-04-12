import Banner from "./components/Banner";
import Hero from "./components/Hero";
import OurMap from "./components/Our-map";
import Standard from "./components/Standards";
import WhyUs from "./components/Why-Us";

export default function Home() {
  return (
    <>
      <Banner />
      <Hero />
      <div className="container mx-auto rounded-lg bg-white p-4 flex flex-col gap-4">
        <WhyUs />
        <Standard />
      </div>
      <OurMap />
    </>
  );
}

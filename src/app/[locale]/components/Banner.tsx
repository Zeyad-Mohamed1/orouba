const Banner = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[85vh] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full md:h-full object-contain md:object-cover"
        >
          <source src="/videos/main-banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default Banner;

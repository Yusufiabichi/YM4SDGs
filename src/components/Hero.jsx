import heroBgImage from '../assets/hero-bg.jpg';

const Hero = () => {
  return (
    <div>
        {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-blue-900/40"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Amplifying Youth Voices <br /> for Global Goals
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white">
            Empowering young people to shape policies, drive grassroots action, and build a sustainable future.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
            >
              Join Us
            </a>
            <a
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-green-600 transition"
            >
              See Our Impact
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
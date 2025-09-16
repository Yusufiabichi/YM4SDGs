import { MegaphoneIcon, GlobeAltIcon, UsersIcon } from "@heroicons/react/24/outline";
import { EyeIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import cardImage1 from '../assets/2.jpg';
import cardImage2 from '../assets/3.jpg';

export default function Stats() {
  const stats = [
    {
      icon: <MegaphoneIcon className="h-10 w-10 text-green-500" />,
      title: "1M+ Youth by 2026",
      description: "Building the largest youth movement for sustainable development",
    },
    {
      icon: <GlobeAltIcon className="h-10 w-10 text-blue-500" />,
      title: "17 Goals, 1 Movement",
      description: "United action across all Sustainable Development Goals",
    },
    {
      icon: <UsersIcon className="h-10 w-10 text-purple-500" />,
      title: "50+ Partnerships",
      description: "Collaborating with organizations worldwide for greater impact",
    },
  ];

  return (
    <>
      <section id="stats" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                {stat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{stat.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-16 bg-white text-center px-6">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Empowering the Next Generation of <br className="hidden sm:block" /> Changemakers
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          We are a global youth network advancing advocacy, innovation, and grassroots action 
          for the UN SDGs. Our mission is to empower youth to influence policy and drive sustainable 
          solutions for a better world.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 - Vision */}
          <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow p-6 text-left">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <EyeIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-600 text-md">
              A world where youth-led action delivers development and equity, creating lasting change for communities worldwide through sustainable solutions.
            </p>
          </div>

          {/* Card 2 - Approach */}
          <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow p-6 text-left">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <LightBulbIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Approach</h3>
            <p className="text-gray-600 text-md">
              Through education, advocacy, and direct action, we build capacity in young leaders and create platforms for meaningful participation in global development.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}



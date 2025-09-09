import { MegaphoneIcon, GlobeAltIcon, UsersIcon } from "@heroicons/react/24/outline";

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
    <section className="bg-white py-16">
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
  );
}

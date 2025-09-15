import { MapPinIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function FeaturedPrograms() {
  return (
    <section className="py-16 bg-white text-center px-6">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Featured Programs
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Driving change through innovative initiatives
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow text-left">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-4">
            <MapPinIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">9ja Climate Walk</h3>
          <p className="text-sm mb-4">
            Nationwide march for climate justice featuring campaigns, placards 
            focusing on SDGs 13–15, tree planting initiatives, and strategic media action.
          </p>
          <a href="#" className="inline-flex items-center font-semibold hover:underline">
            Learn More <span className="ml-1">→</span>
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow text-left">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-4">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Youth Climate Summit</h3>
          <p className="text-sm mb-4">
            Annual 1–2 day hybrid event featuring keynotes, panels, workshops, and the 
            Youth Climate Action Declaration to unite voices globally.
          </p>
          <a href="#" className="inline-flex items-center font-semibold hover:underline">
            Learn More <span className="ml-1">→</span>
          </a>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow text-left">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-4">
            <ClockIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Climate Leadership Programme</h3>
          <p className="text-sm mb-4">
            Intensive 6–8 week training with bootcamps, mentorship, community projects, 
            and official certification for emerging leaders.
          </p>
          <a href="#" className="inline-flex items-center font-semibold hover:underline">
            Learn More <span className="ml-1">→</span>
          </a>
        </div>
      </div>

      {/* Button */}
      <div className="mt-12">
        <a
          href="#"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
        >
          View All Programs
        </a>
      </div>
    </section>
  );
}

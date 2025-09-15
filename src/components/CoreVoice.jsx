import React from 'react'

const CoreVoice = () => {
  return (
        <section className="py-16 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 text-center px-6">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Our Core Values: VOICE
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        The principles that guide our movement
      </p>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-10 max-w-6xl mx-auto">
        {/* Voice */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-xl shadow-lg mb-4">
            V
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Voice</h3>
          <p className="text-gray-600 text-sm mt-1">
            Amplifying youth perspectives in decision-making
          </p>
        </div>

        {/* Ownership */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl shadow-lg mb-4">
            O
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Ownership</h3>
          <p className="text-gray-600 text-sm mt-1">
            Taking responsibility for sustainable change
          </p>
        </div>

        {/* Innovation */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-xl shadow-lg mb-4">
            I
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Innovation</h3>
          <p className="text-gray-600 text-sm mt-1">
            Creating new solutions for old problems
          </p>
        </div>

        {/* Consistency */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xl shadow-lg mb-4">
            C
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Consistency</h3>
          <p className="text-gray-600 text-sm mt-1">
            Sustained commitment to our mission
          </p>
        </div>

        {/* Empowerment */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-xl shadow-lg mb-4">
            E
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Empowerment</h3>
          <p className="text-gray-600 text-sm mt-1">
            Building capacity in young leaders
          </p>
        </div>
      </div>
    </section>
  )
}

export default CoreVoice
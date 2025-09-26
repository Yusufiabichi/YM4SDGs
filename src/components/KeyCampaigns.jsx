// src/components/KeyCampaigns.jsx
import {
  BoltIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";


export default function KeyCampaigns() {
  const campaigns = [
    {
      title: "#PolicyHackChallenge",
      description: "Innovating policy solutions through technology",
      bg: "bg-purple-100",
      textColor: "text-purple-600",
      icon: <CodeBracketIcon className="w-6 h-6" />,
    },
    {
        title: "#FromGrassrootsToGoals",
        description: "Community-driven sustainable development",
        bg: "bg-green-100",
        textColor: "text-green-600",
        icon: <GlobeAltIcon className="w-6 h-6" />,
    },
    {
      title: "#YouthSDGVoices",
      description: "Amplifying youth stories and perspectives",
      bg: "bg-blue-100",
      textColor: "text-blue-600",
      icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
    },
    {
      title: "#Act4SDGsSeries",
      description: "Action-oriented campaigns for each SDG",
      bg: "bg-orange-100",
      textColor: "text-orange-600",
      icon: <BoltIcon className="w-6 h-6" />,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Key Campaigns
      </h2>
      <p className="text-gray-600 mb-12">
        Mobilizing action across multiple fronts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {campaigns.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div
              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${item.bg} ${item.textColor}`}
            >
              {item.icon}
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

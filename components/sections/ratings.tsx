import { Award, Star, Trophy, Zap } from "lucide-react";

export function Ratings() {
  return (
    <div className="bg-gradient-main py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="font-semibold text-yellow-500">
                Top Rated in AI Image Generator Leaderboard
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white">
              Leading the Future of AI Creation
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Consistently ranked as the leading AI image generator for quality,
              speed, and innovation. Our advanced models deliver exceptional
              results across all creative needs.
            </p>
            <div className="mb-8 flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-500 text-yellow-500"
                />
              ))}
              <span className="ml-2 font-semibold text-white">9.8/10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              {
                icon: <Star className="h-6 w-6" />,
                metric: "9.8/10",
                label: "Image Quality",
                detail: "Highest rated for detail & realism",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                metric: "1.7s",
                label: "Generation Speed",
                detail: "Fastest in its class",
              },
              {
                icon: <Award className="h-6 w-6" />,
                metric: "99.9%",
                label: "Consistency",
                detail: "Most reliable outputs",
              },
              {
                icon: <Trophy className="h-6 w-6" />,
                metric: "#1",
                label: "Overall Ranking",
                detail: "Top AI image generator",
              },
            ].map((rating, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-colors hover:border-purple-500"
              >
                <div className="mb-4 text-purple-400 transition-transform group-hover:scale-110">
                  {rating.icon}
                </div>
                <div className="mb-2 text-2xl font-bold text-white">
                  {rating.metric}
                </div>
                <div className="mb-1 font-medium text-purple-400">
                  {rating.label}
                </div>
                <div className="text-sm text-gray-400">{rating.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

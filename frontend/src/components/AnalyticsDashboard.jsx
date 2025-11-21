import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line
} from "recharts";

const AnalyticsDashboard = ({ name, userId }) => {
  const { fetchPortfolios, fetchVisits } = useAuth();
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const loadPortfolios = async () => {
      const data = await fetchPortfolios(userId);

      const portfoliosWithVisits = await Promise.all(
        data.map(async (p) => {
          const visit = await fetchVisits(p.username);
          

          return {
            ...p,
            totalVisits: visit?.totalVisits || 0,
            growthPercentage: visit?.growthPercentage || 0,
            lastFiveMonths: visit?.lastFiveMonths || []
          };
        })
      );

      setPortfolios(portfoliosWithVisits);
    };

    loadPortfolios();
  }, [userId]);

  return (
    <div className="p-6 min-h-screen bg-[#0e0e0e] text-gray-200">
      <h1 className="text-2xl md:text-4xl font-extrabold text-[#20d78d] mb-2">
        Dashboard
      </h1>

      <p className="mb-6 text-gray-400">
        Welcome {name}! Here's your portfolio performance.
      </p>

      {/* GRID FOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolios.length === 0 ? (
          <div className="text-gray-400 col-span-full">
            No portfolios found. Create one to see its performance.
          </div>
        ) : (
          [...portfolios].reverse().map((p) => {
            const chartData = (p.lastFiveMonths || []).map((m) => ({
              name: m.month,
              value: m.count
            }));

            return (
              <div
                key={p._id}
                className="bg-[#111] border border-[#20d78d]/30 rounded-xl p-5 flex justify-between items-center w-full shadow-md"
              >
                {/* Left Text */}
                <div>
                  <h2 className="text-xl font-semibold text-[#20d78d]">
                    {p.title}
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Total Visits: {p.totalVisits}
                  </p>
                  <p className="text-gray-300">
                    Growth: {p.growthPercentage}%
                  </p>
                </div>

                {/* Mini Chart */}
                <div className="w-40 h-28 md:w-52 md:h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barCategoryGap={12}>
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#bbb", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Bar
                        dataKey="value"
                        fill="#20d78d"
                        radius={[5, 5, 0, 0]}
                        barSize={18}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#24bfa1"
                        strokeWidth={2}
                        dot={{ r: 2, fill: "#24bfa1" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

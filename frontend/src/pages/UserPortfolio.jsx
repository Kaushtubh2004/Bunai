import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { useAuth } from '../context/AuthContext';
import PortfolioOne from '../components/portfolios/PortfolioOne';
import PortfolioTwo from '../components/portfolios/PortfolioTwo';
import PortfolioThree from '../components/portfolios/PortfolioThree';
import PortfolioFour from '../components/portfolios/PortfolioFour';
import PortfolioFive from '../components/portfolios/PortfolioFive';
import PortfolioSix from '../components/portfolios/PortfolioSix';

const UserPortfolio = () => {
  const { fetchAllDataUsingUsername } = useAuth();
  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  const loadAllData = async () => {
    if (!username) return;

    try {
      const data = await fetchAllDataUsingUsername(username);
      setFetchedUser(data);
    } catch (error) {
      setFetchedUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [username]);
  
  if (loading) return <div className="w-full h-screen flex items-center justify-center bg-[#0e0e0e] text-[#20d78d]">Loading...</div>;

  // FIXED: safe check
  if (!fetchedUser || !fetchedUser.portfolio?.theme) return <NotFound />;

  const theme = fetchedUser.portfolio.theme;

  switch (theme) {
    case "Minimal":
      return <PortfolioOne data={fetchedUser} pageId={username} />;
    case "Premium":
      return <PortfolioTwo data={fetchedUser} pageId={username} />;
    case "Fresh":
      return <PortfolioThree data={fetchedUser} pageId={username}/>;
    case "Urban":
      return <PortfolioFour data={fetchedUser} pageId={username}/>;
    case "Soft":
      return <PortfolioFive data={fetchedUser} pageId={username}/>;
    case "Vibrant":
      return <PortfolioSix data={fetchedUser} pageId={username}/>;
    default:
      return <NotFound />;
  }
};

export default UserPortfolio;

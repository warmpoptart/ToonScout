import React, { useEffect, useState } from "react";
import Disclaimer from "./Disclaimer";
import TabContainer from "./tabs/components/TabComponent";
import "/styles/home.css";
import { useDiscordContext } from "@/app/context/DiscordContext";
import { handleOAuthToken } from "@/app/api/DiscordOAuth";
import Header from "./Header";
import { useToonContext } from "@/app/context/ToonContext";
import GameSteps from "../GameSteps";
import Chuckle from "../eggs/Chuckle";
import SystemBanner from "./SystemBanner";

const Home = () => {
  const { userId, setUserId } = useDiscordContext();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { toons } = useToonContext();
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_HTTP + "/token/get-token",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Token found.");
        const { userId } = await response.json();
        if (userId) {
          setUserId(userId); // Set userId from the response
        } else {
          console.log("No user ID found.");
        }
      } else {
        console.log("No token found.");
      }
    };

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");

    if (accessToken) {
      handleOAuthToken(fragment).then((userId) => {
        if (userId) {
          setUserId(userId);
        } else {
          console.log("ID error: failed to find data in cookie");
        }
      });
    } else {
      checkAccessToken();
    }
  }, []);

  const handleCloseBanner = () => {
    setIsBannerOpen(false);
  };

  return (
    <div className="card-container">
      <div className="home-card">
        <Header
          userId={userId}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />

        {isBannerOpen && (
          <SystemBanner isOpen={isBannerOpen} onClose={handleCloseBanner} />
        )}

        {toons && toons.length > 0 ? (
          <>
            <div className="px-6 pt-6">
              <TabContainer />
            </div>

            <div className="px-6">
              <Disclaimer />
            </div>
          </>
        ) : (
          <GameSteps />
        )}
      </div>
      <Chuckle />
    </div>
  );
};

export default Home;

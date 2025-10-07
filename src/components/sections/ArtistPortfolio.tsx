import React from "react";
import Discography from "./Discography";
import Biography from "./Biography";
import TourDates from "./TourDates";
import Merchandise from "./Merchandise";

const ArtistPortfolio: React.FC = () => {
  return (
    <>
      <Discography />
      <Biography />
      <TourDates />
      <Merchandise />
    </>
  );
};

export default ArtistPortfolio;

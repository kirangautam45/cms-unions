/* eslint-disable prettier/prettier */
import { loadList } from "services/request";
import apiLinks from "./apiLinks";

const objects = {
  calendar: null,

  loadRegions: (fAfterLoadRegions) => {
    loadList(apiLinks.loadTheRegions, ({ data }) => {
      fAfterLoadRegions(data);
    });
  },

  loadCountries: (fAfterLoadCountries) => {
    loadList(apiLinks.loadTheCountries, ({ data }) => {
      fAfterLoadCountries(data);
    });
  },

  loadTheLeagues: (fAfterLoadTheLeagues) => {
    loadList(apiLinks.loadTheLeagues, ({ data }) => {
      fAfterLoadTheLeagues(data);
    });
  },
};

export default objects;

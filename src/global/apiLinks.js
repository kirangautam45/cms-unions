const apiLinks = {
  deleteUser: `union/members/delete/`,
  loadAllMembers: `union/members/all`,
  createUser: `union/members/create/manually`,
  updateUser: `union/members/update/`,
  searchUser: `union/member/search/`,

  login: "auth/login",
  refreshToken: "auth/refreshtoken",

  benefitsAll: (page, size) => `union/benefit/all?page=${page - 1}&size=${size}`,
  deleteBenefit: `union/benefit/delete/`,
  createBenefit: `union/benefit/create`,
  updateBenefit: `union/benefit/update/`,
  searchBenefit: `union/benefit/search/`,

  loadAllEvents: `union/calendar/all/events`,
  loadEventById: `union/calendar/get/event/`,
  updateEvent: `union/calendar/update/event/`,
  deleteEvent: `union/calendar/delete/event/`,
  createEvent: `union/calendar/create/union/event`,

  updateTeam: `team/edit/team/`,
  createTeam: `team/add/new/team`,
  deleteTeam: `team/delete/team/`,
  getTeam: `team/team/`,
  getTeamMembers: `team/members/`,

  loadTheRegions: `team/regions`,
  loadTheCountries: `team/countries`,
  loadTheLeagues: `team/leagues`,
  searchTheTeams: `team/filter`,

  loadTopicDetails: `union/topics/`,
  loadPostsOfTopic: (id, page = 0) => `union/posts/all/topic/${id}?page=${page}&size=10`,

  loadAllPodcast: (page, size) => `union/podcasts?page=${page - 1}&size=${size}`,
  loadPodcastById: `union/podcasts/`,
  deletePodcast: `union/delete/podcasts/`,
  updatePodcast: `union/update/podcasts/`,
  createPodcast: `union/save/podcasts`,

  loadAllProgram: (page, size) => `union/programs/all?page=${page - 1}&size=${size}`,
  loadProgramById: (id) => `union/programs/${id}`,
  deleteProgram: `union/programs/delete/`,
  updateProgram: `union/programs/update/`,
  createProgram: `union/programs/create`,

  // for faq
  loadFAQCategories: (page) => `union/faq-categories?provider=ELPA&page=${page}&size=9`,
  loadFAQCategoryById: (id) => `union/faq-categories/${id}`,
  createFAQCategory: `union/create/faq-categories`,
  updateFAQCategory: `union/update/faq-categories/`,
  deleteFAQCategory: `union/delete/faq-categories/`,
  createFAQ: `union/create/faqs`,
  loadFAQByCategoryId: (id) => `union/faq-categories/${id}/faqs`,
  updateFAQById: (id) => `union/update/faqs/${id}`,
  deleteFAQById: `union/delete/faqs/`,

  getYoutubeVideoThumbnail: (videoId) => `https://img.youtube.com/vi/${videoId}/1.jpg`,

  // this is global variable for events calendar
  calendar: null,
};

export default apiLinks;

const loggedUser = {
  loggedUserData: () => {
    if (
      localStorage.getItem("loggedUser") === "undefined" ||
      localStorage.getItem("loggedUser") === "undefined" ||
      localStorage.getItem("loggedUser") === undefined ||
      localStorage.getItem("loggedUser") === null
    ) {
      return {
        name: "",
        sub: "",
        firstName: "",
        lastName: "",
        email: "",
      };
    }
    return JSON.parse(localStorage.getItem("loggedUser"));
  },

  id: () => loggedUser.loggedUserData().sub || "",
  email: () => loggedUser.loggedUserData().email || "",
  firstName: () => loggedUser.loggedUserData().firstName || "",
  lastName: () => loggedUser.loggedUserData().lastName || "",
  fullName: () => loggedUser.loggedUserData().name || "",
};

export default loggedUser;

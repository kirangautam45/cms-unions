const Cookie = {
  setCookie(name, value, minutesExpired) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesExpired);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  },
  removeCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  },
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const partsPop = parts.pop();
      if (partsPop) {
        return partsPop.split(";").shift();
      }
      return "";
    }
    return "";
  },
  checkCookie(name) {
    const val = this.getCookie(name);
    if (val !== "" && val !== null) {
      return true;
    }
    return false;
  },
};

export default Cookie;

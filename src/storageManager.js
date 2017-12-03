export const twitterTokenStorage = {
  getCredentials: () => {
    return JSON.parse(localStorage.getItem("twitter:tokens"));
  },
  setCredentials: (token, secret) => {
    localStorage.setItem("twitter:tokens", JSON.stringify({
      token,
      secret
    }));
  }
}
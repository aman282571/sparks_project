export function getToken() {
  let token = localStorage.getItem("id");
  console.log(token);
  if (!token) return token;
  else return JSON.parse(token);
}
export function setToken(token) {
  localStorage.setItem("id", JSON.stringify(token));
}

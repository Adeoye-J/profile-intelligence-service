
import axios from "axios";

export async function exchangeCodeForGithubToken(code, codeVerifier) {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      code_verifier: codeVerifier
    },
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (response.data.error) {
    throw new Error(response.data.error_description || response.data.error);
  }

  return response.data.access_token;
}

export async function getGithubUser(accessToken) {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json"
    }
  });

  return response.data;
}
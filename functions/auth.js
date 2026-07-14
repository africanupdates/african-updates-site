export async function onRequest(context) {
  const { GITHUB_CLIENT_ID } = context.env;
  const redirectURI = `https://african-updates-site.pages.dev/callback`;
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectURI}&scope=repo`;
  return Response.redirect(githubAuthURL, 302);
} 

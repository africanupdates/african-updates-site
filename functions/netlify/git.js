export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/.netlify/git', '');
  const netlifyUrl = `https://africanupdates.netlify.app/.netlify/git${path}${url.search}`;

  const headers = new Headers(context.request.headers);
  headers.delete('host');

  return fetch(netlifyUrl, {
    method: context.request.method,
    headers: headers,
    body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
  });
}

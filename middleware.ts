// @ts-nocheck

export const config = {
  matcher: ['/(.*)'],
};

export default function middleware(req) {
  // This middleware is not used in this project.
  return new Response(null);
}

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/dashboard/:path*", "/employees/:path*", "/insights/:path*", "/dataset/:path*", "/settings/:path*"],
};

import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers"; // new client wrapper

export const metadata: Metadata = {
  title: "Simple To-Do App",
  description: "Boost your productivity with this SEO-friendly to-do app. Add, manage, and track tasks seamlessly.",
  keywords: ["to-do app", "task manager", "productivity tool", "task tracker", "organizer"],
  authors: [{ name: "Todo", url: process.env.NEXT_PUBLIC_BASE_URL }],
  creator: "Todo",
  openGraph: {
    title: "Smart and Simple To-Do App",
    description: "Manage your tasks effectively with our intuitive and fast to-do app.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Smart and Simple To-Do App",
    images: [
      {
        url: "https://th.bing.com/th/id/OIP.M-WcHeXzhs0Q-tVAPlm70AHaFj?cb=iwc2&rs=1&pid=ImgDetMain",
        width: 1200,
        height: 630,
        alt: "Smart To-Do App Preview",
      },
    ],
    type: "website",
  },
};


const RootLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

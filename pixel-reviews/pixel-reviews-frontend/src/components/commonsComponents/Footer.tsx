import { Github, Instagram } from "lucide-react";
import { FooterUi } from "../ui/footer-ui";
import logo from "@/assets/logo.png";

function Footer() {
  const socialLinks = [
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://www.instagram.com/yisus_daniel1984",
      label: "Instagram",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/Yisusocanto",
      label: "GitHub",
    },
  ];
  // const mainLinks = [
  //   { href: "/products", label: "Products" },
  //   { href: "/about", label: "About" },
  //   { href: "/blog", label: "Blog" },
  //   { href: "/contact", label: "Contact" },
  // ];
  // const legalLinks = [
  //   { href: "/privacy", label: "Privacy" },
  //   { href: "/terms", label: "Terms" },
  // ];
  return (
    <div className="w-full">
      <FooterUi
        logo={<img src={logo} alt="website's logo" className="w-10 h-10" />}
        brandName="Pixel Reviews"
        socialLinks={socialLinks}
        mainLinks={[]}
        legalLinks={[]}
        copyright={{
          text: "© 2025 Pixel Reviews",
          license: "All rights reserved",
        }}
      />
    </div>
  );
}

export { Footer };

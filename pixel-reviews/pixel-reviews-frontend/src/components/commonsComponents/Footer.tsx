import { Hexagon, Github, Instagram } from "lucide-react"
import { FooterUi } from "../ui/footer-ui"

function Footer() {
  return (
    <div className="w-full">
      <FooterUi
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Pixel Reviews"
        socialLinks={[
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
        ]}
        mainLinks={[
          { href: "/products", label: "Products" },
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2025 Pixel Reviews",
          license: "All rights reserved",
        }}
      />
    </div>
  )
}

export { Footer }
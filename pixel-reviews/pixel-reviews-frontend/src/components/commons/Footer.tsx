import { FooterUi } from "@/components/ui/footer";
import { socialLinks } from "@/constants/navigation";

function Footer() {
  return (
    <div className="w-full">
      <FooterUi
        logo={
          <img src={"/logo.png"} alt="website's logo" width={25} height={25} />
        }
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

import Image from "next/image";
import { brand, navigation } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";
import companyLogo from "../../../public/images/logos/sanbon-fnb.png";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <a href="#top" className="footer-wordmark" aria-label="뚝손국밥 처음으로">
              <Image
                src={brandLogo}
                alt="뚝손국밥"
                className="footer-brand-logo"
                sizes="(max-width: 599px) 150px, 174px"
              />
            </a>
            <p className="footer-tagline">한 그릇을 제대로.</p>
          </div>
          <div className="footer-company">
            <div className="footer-company-identity">
              <Image
                src={companyLogo}
                alt="산본에프앤비"
                className="footer-company-logo"
                sizes="(max-width: 599px) 82px, 96px"
              />
              <strong>SANBON F&B</strong>
            </div>
            <p>{brand.company}</p>
            <p>
              사업자 정보 · 주소 · 연락처{" "}
              <span className="pending-text">안내 준비 중</span>
            </p>
          </div>
          <a className="back-top" href="#top" aria-label="페이지 맨 위로">
            <ArrowIcon />
          </a>
        </div>
        <div className="footer-bottom">
          <small>
            © {new Date().getFullYear()} SANBON F&B. All rights reserved.
          </small>
          <nav aria-label="하단 메뉴">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <span className="draft-label">BRAND WEBSITE DRAFT</span>
        </div>
      </div>
    </footer>
  );
}

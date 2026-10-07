import Image from "next/image";
import { brand, navigation } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";
import companyLogo from "../../../public/images/logos/sanbon-fnb.png";

export function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="container">
        <Reveal effect="fade" duration={0.65} className="footer-main">
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
              <strong>산본에프앤비</strong>
            </div>
            <p>{brand.company}</p>
            <p>대표자 : {brand.representatives}</p>
            <p>사업자등록번호 : {brand.businessNumber}</p>
            <p>주소 : {brand.address}</p>
            <p className="footer-contact-row">
              대표번호 : <a href={brand.phoneHref}>{brand.phone}</a>
            </p>
            <p className="footer-contact-row">
              이메일 : <a href={`mailto:${brand.email}`}>문의 보내기</a>
            </p>
          </div>
          <a className="back-top" href="#top" aria-label="페이지 맨 위로">
            <ArrowIcon />
          </a>
        </Reveal>
        <div className="footer-bottom">
          <small>
            © {new Date().getFullYear()} 산본에프앤비. 모든 권리 보유.
          </small>
          <nav aria-label="하단 메뉴">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <span className="draft-label">브랜드 홈페이지 시안</span>
        </div>
      </div>
    </footer>
  );
}

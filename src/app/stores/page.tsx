import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StoreDirectorySection } from "@/components/sections/StoreDirectorySection";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo";
import { getStoreDirectory } from "@/lib/stores";
import { ArrowIcon } from "@/components/ui/Icons";
import brandLogo from "../../../public/images/logos/ddukson-gukbap.png";
import styles from "./page.module.css";

const title = "가맹점 찾기 | 뚝손국밥";
const description = "뚝손국밥 매장 안내. 등록된 매장의 주소와 연락처를 확인하고 길찾기를 이용하세요.";

export async function generateMetadata(): Promise<Metadata> {
  const directory = await getStoreDirectory();
  return createPageMetadata({ path: "/stores", title, description,
    ready: !directory.error && directory.stores.length > 0 });
}

// Public store page. The shared section is currently hidden on the homepage.
export default function StoresPage() {
  return (
    <>
      <StructuredData path="/stores" title={title} description={description} />
      <a className="skip-link" href="#main">본문으로 바로가기</a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" aria-label="뚝손국밥 메인페이지">
            <Image src={brandLogo} alt="뚝손국밥" className={styles.logo} sizes="124px" priority />
          </Link>
          <Link href="/#inquiry" className="button button-primary">
            창업 문의 <ArrowIcon />
          </Link>
        </div>
      </header>
      <main id="main">
        <StoreDirectorySection headingLevel={1} />
      </main>
      <footer className={`container ${styles.footer}`}>
        <Link href="/">메인페이지로 <ArrowIcon /></Link>
        <small>© {new Date().getFullYear()} 산본에프앤비.</small>
      </footer>
    </>
  );
}

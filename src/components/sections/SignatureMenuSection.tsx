import { MenuGallery } from "@/components/ui/MenuGallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { menuCategories } from "@/data/menus";
import styles from "./SignatureMenuSection.module.css";

export function SignatureMenuSection() {
  return (
    <section
      id="menu"
      className="section menu-section section-background-host"
      aria-labelledby="menu-title"
    >
      <SectionBackground name="nurungji" className="menu-background" />
      <div className="container">
        <div className="section-heading menu-heading">
          <Reveal>
            <h2 id="menu-title" className="section-title">
              가장 자신 있는
              <br />
              뚝손의 한 그릇.
            </h2>
          </Reveal>
        </div>
        <MenuGallery />
        <details className={styles.menuDirectory}>
          <summary className={styles.summary}>전체 메뉴 보기</summary>
          <div className={styles.categories}>
            {menuCategories.map((category) => (
              <div key={category.id} className={styles.category}>
                <h3>{category.name}</h3>
                {category.groups ? category.groups.map((group) => (
                  <div key={group.id} className={styles.group}>
                    <h4>{group.name}</h4>
                    <ul>
                      {group.items.map((menu) => <li key={menu.id}>{menu.name}</li>)}
                    </ul>
                  </div>
                )) : (
                  <ul>
                    {category.items.map((menu) => <li key={menu.id}>{menu.name}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

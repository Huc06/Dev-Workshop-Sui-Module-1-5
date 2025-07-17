import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
  highlights: string[];
};

const FeatureList: FeatureItem[] = [
  {
    title: "Move Language",
    img: require("@site/static/img/mascot1.png").default,
    description: (
      <>
        Ngôn ngữ lập trình được thiết kế đặc biệt cho blockchain, đảm bảo an
        toàn và hiệu suất cao cho smart contracts.
      </>
    ),
    highlights: ["An toàn tuyệt đối", "Hiệu suất cao", "Dễ học và sử dụng"],
  },
  {
    title: "Sui Network",
    img: require("@site/static/img/mascot2.png").default,
    description: (
      <>
        Blockchain thế hệ mới với khả năng mở rộng vô hạn, tốc độ giao dịch
        nhanh và phí gas thấp.
      </>
    ),
    highlights: ["297K+ TPS", "~400ms finality", "Phí gas thấp"],
  },
  {
    title: "Tài liệu Việt",
    img: require("@site/static/img/mascot3.png").default,
    description: (
      <>
        Hướng dẫn chi tiết bằng tiếng Việt với ví dụ thực tế, từ cơ bản đến nâng
        cao cho mọi trình độ.
      </>
    ),
    highlights: ["Dễ hiểu", "Ví dụ thực tế", "Cập nhật liên tục"],
  },
];

function Feature({ title, img, description, highlights }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className={styles.featureCard}>
        <div className={styles.featureImageWrapper}>
          <img src={img} alt={title} className={styles.featureSvg} />
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <p className={styles.featureDescription}>{description}</p>
          <ul className={styles.featureHighlights}>
            {highlights.map((highlight, idx) => (
              <li key={idx} className={styles.highlightItem}>
                <span className={styles.checkIcon}>✓</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Tại sao chọn Sui?</h2>
          <p className={styles.featuresSubtitle}>
            Khám phá những tính năng độc đáo và ưu việt của Sui blockchain
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

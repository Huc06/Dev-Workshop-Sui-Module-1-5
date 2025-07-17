import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import mascot1 from "@site/static/img/mascot1.png";
import mascot2 from "@site/static/img/mascot2.png";
import mascot3 from "@site/static/img/mascot3.png";

type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Học Move Language",
    img: mascot1,
    description: (
      <>
        Tìm hiểu ngôn ngữ lập trình Move - ngôn ngữ mạnh mẽ và an toàn để xây
        dựng smart contracts trên Sui blockchain. Từ cơ bản đến nâng cao.
      </>
    ),
  },
  {
    title: "Xây dựng dApps",
    img: mascot2,
    description: (
      <>
        Hướng dẫn từng bước để tạo ra các ứng dụng phi tập trung (dApps) trên
        Sui. Từ NFT collections đến các ứng dụng DeFi phức tạp.
      </>
    ),
  },
  {
    title: "Tài liệu Tiếng Việt",
    img: mascot3,
    description: (
      <>
        Tài liệu đầy đủ bằng tiếng Việt, dễ hiểu và có ví dụ thực tế. Phù hợp
        cho cả người mới bắt đầu và developer có kinh nghiệm.
      </>
    ),
  },
];

function Feature({ title, img, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={img} alt={title} className={styles.featureSvg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

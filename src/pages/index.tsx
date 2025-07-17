import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Xây dựng trên <span className={styles.suiHighlight}>Sui</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Tài liệu hướng dẫn phát triển Sui blockchain bằng tiếng Việt
          </p>
          <p className={styles.heroDescription}>
            Học cách xây dựng ứng dụng phi tập trung với Move language trên Sui
            Network - blockchain nhanh nhất, an toàn nhất và thân thiện với nhà
            phát triển
          </p>

          <div className={styles.heroActions}>
            <Link
              className="button button--primary button--lg"
              to="/move-language/hello_world.move"
            >
              Bắt đầu xây dựng
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/sui-blockchain/intro"
            >
              Tìm hiểu Sui
            </Link>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>297K+</div>
            <div className={styles.statLabel}>TPS</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>~400ms</div>
            <div className={styles.statLabel}>Finality</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>159M+</div>
            <div className={styles.statLabel}>Active Accounts</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function LearningPaths() {
  const paths = [
    {
      icon: "📚",
      title: "Tìm hiểu Sui Blockchain",
      description: "Khám phá kiến trúc và tính năng độc đáo của Sui",
      link: "/sui-blockchain/intro",
      color: "blue",
    },
    {
      icon: "⚡",
      title: "Học Move Language",
      description: "Làm chủ ngôn ngữ lập trình an toàn cho smart contracts",
      link: "/move-language/intro",
      color: "purple",
    },
    {
      icon: "🌐",
      title: "Xây dựng Frontend",
      description: "Tích hợp ứng dụng web với Sui blockchain",
      link: "/web3-frontend/intro",
      color: "green",
    },
  ];

  return (
    <section className={styles.learningPaths}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Lộ trình học tập</h2>
        <p className={styles.sectionSubtitle}>
          Hành trình từ người mới bắt đầu đến Sui developer chuyên nghiệp
        </p>

        <div className={styles.pathsGrid}>
          {paths.map((path, idx) => (
            <Link
              key={idx}
              to={path.link}
              className={clsx(
                styles.pathCard,
                styles[`pathCard--${path.color}`]
              )}
            >
              <div className={styles.pathIcon}>{path.icon}</div>
              <h3 className={styles.pathTitle}>{path.title}</h3>
              <p className={styles.pathDescription}>{path.description}</p>
              <div className={styles.pathArrow}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout>
      <Head>
        <title>Sui Hub Tiếng Việt - Tài liệu phát triển Sui Blockchain</title>
        <meta
          name="description"
          content="Tài liệu hướng dẫn phát triển Sui blockchain bằng tiếng Việt - Học Move language và xây dựng dApps trên Sui Network"
        />
      </Head>
      <HomepageHeader />
      <main>
        <LearningPaths />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

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
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          Tài liệu hướng dẫn phát triển Sui blockchain bằng tiếng Việt
        </p>
        <p className="hero__subtitle">
          Học cách xây dựng ứng dụng phi tập trung trên Sui Network với Move
          language
        </p>

        {/* Learning Path Section */}
        <div className={styles.learningPath}>
          <h3>🚀 Bắt đầu hành trình của bạn:</h3>
          <div className={styles.pathButtons}>
            <Link
              className="button button--secondary button--lg margin--sm"
              to="/sui-blockchain/intro"
            >
              📚 1. Tìm hiểu Sui Blockchain
            </Link>
            <Link
              className="button button--secondary button--lg margin--sm"
              to="/move-language/intro"
            >
              ⚡ 2. Học Move Language
            </Link>
            <Link
              className="button button--secondary button--lg margin--sm"
              to="/web3-frontend/intro"
            >
              🌐 3. Xây dựng Frontend
            </Link>
            <Link
              className="button button--secondary button--lg margin--sm"
              to="/community/intro"
            >
              👥 4. Tham gia Community
            </Link>
          </div>
        </div>

        <div className={styles.quickActions}>
          <Link
            className="button button--primary button--lg"
            to="/move-language/hello_world.move"
          >
            Viết code đầu tiên ngay! 💻
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout>
      <Head>
        <title>Trang chủ</title>
        <meta
          name="description"
          content="Tài liệu hướng dẫn phát triển Sui blockchain bằng tiếng Việt - Học Move language và xây dựng dApps"
        />
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

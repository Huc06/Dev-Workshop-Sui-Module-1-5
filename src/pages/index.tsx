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
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/sui-blockchain/intro"
          >
            Bắt đầu học ngay
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

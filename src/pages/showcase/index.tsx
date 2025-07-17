import React, { useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import {
  Users,
  TagList,
  type User,
  type TagType,
} from "@site/src/data/showcase";

import styles from "./styles.module.css";

function ShowcaseCard({ user }: { user: User }) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className={`card ${styles.showcaseCard}`}>
        {user.preview && (
          <div className="card__image">
            <img src={user.preview} alt={user.title} />
          </div>
        )}
        <div className="card__body">
          <h3>{user.title}</h3>
          <p>{user.description}</p>
          <div className={styles.cardTags}>
            {user.tags.map((tag) => (
              <span
                key={tag}
                className={styles.tag}
                style={{ backgroundColor: TagList[tag].color }}
              >
                {TagList[tag].label}
              </span>
            ))}
          </div>
        </div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            <Link className="button button--primary" to={user.website}>
              Website
            </Link>
            {user.source && (
              <Link className="button button--secondary" to={user.source}>
                GitHub
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TagFilter({
  selectedTags,
  onTagChange,
}: {
  selectedTags: TagType[];
  onTagChange: (tag: TagType) => void;
}) {
  return (
    <div className={styles.tagFilter}>
      <h3>Lọc theo danh mục:</h3>
      <div className={styles.tagButtons}>
        {Object.entries(TagList).map(([tag, { label, color }]) => (
          <button
            key={tag}
            className={`button button--sm ${
              selectedTags.includes(tag as TagType)
                ? "button--primary"
                : "button--outline"
            }`}
            onClick={() => onTagChange(tag as TagType)}
            style={
              selectedTags.includes(tag as TagType)
                ? { backgroundColor: color, borderColor: color }
                : {}
            }
          >
            {label}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button
            className="button button--secondary button--sm"
            onClick={() => onTagChange(null as any)}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}

export default function Showcase(): React.JSX.Element {
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTagChange = (tag: TagType) => {
    if (!tag) {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredUsers = Users.filter((user) => {
    const matchesSearch = user.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => user.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <Layout>
      <Head>
        <title>Showcase</title>
        <meta
          name="description"
          content="Khám phá các dự án xuất sắc được xây dựng trên Sui blockchain"
        />
      </Head>
      <main className="margin-vert--lg">
        <div className="container">
          <div className="text--center margin-bottom--xl">
            <h1>Showcase</h1>
            <p className="hero__subtitle">
              Khám phá các dự án xuất sắc được xây dựng trên Sui blockchain
            </p>
            <Link
              className="button button--primary button--lg"
              to="https://github.com/terrancrypt/sui-docs-vn"
            >
              🙏 Đóng góp dự án của bạn
            </Link>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <TagFilter
              selectedTags={selectedTags}
              onTagChange={handleTagChange}
            />
          </div>

          <div className="margin-top--lg">
            <p className="text--center">
              <strong>{filteredUsers.length}</strong> dự án được tìm thấy
            </p>
          </div>

          <div className="row margin-top--lg">
            {filteredUsers.map((user) => (
              <ShowcaseCard key={user.title} user={user} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text--center margin-top--xl">
              <h3>Không tìm thấy dự án nào</h3>
              <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

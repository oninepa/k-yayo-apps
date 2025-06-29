'use client';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <Link href="/">Home</Link>
          <Link href="#" onClick={() => window.history.back()}>Back</Link>
        </div>
        <h1>K-YAYO</h1>
        <div>
          <span className={styles.languageSelector}>EN</span>
          <span>Menu</span>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <Link href="/board" className={styles.navItem}>Board</Link>
        <Link href="/blog" className={styles.navItem}>Blog</Link>
        <Link href="/info" className={styles.navItem}>K-Info</Link>
      </div>
    </header>
  );
}
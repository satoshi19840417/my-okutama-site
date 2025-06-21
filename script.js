// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// スロットル関数
function throttle(func, wait) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

// 最適化されたスクロール処理
const optimizedScrollHandler = throttle(() => {
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 50) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    } else {
      header.style.backgroundColor = "#fff";
      header.style.boxShadow = "none";
    }
  }
}, 16); // ~60fps

window.addEventListener("scroll", optimizedScrollHandler, { passive: true });

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 改善された画像の遅延読み込み
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // WebP対応チェック
          const canvas = document.createElement("canvas");
          const webpSupported =
            canvas.toDataURL("image/webp").indexOf("webp") > -1;

          if (webpSupported && img.dataset.webp) {
            img.src = img.dataset.webp;
          } else {
            img.src = img.dataset.src;
          }

          img.classList.add("loaded");
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.01,
    },
  );
  lazyImages.forEach((img) => imageObserver.observe(img));

  // 動画の遅延読み込み
  const lazyVideos = document.querySelectorAll("video source[data-src]");
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target.closest("video");
          const source = video.querySelector("source[data-src]");
          if (source) {
            source.src = source.dataset.src;
            source.removeAttribute("data-src");
            video.load();
            videoObserver.unobserve(entry.target);
          }
        }
      });
    },
    {
      rootMargin: "100px",
      threshold: 0.01,
    },
  );

  lazyVideos.forEach((source) => {
    const video = source.closest("video");
    if (video) videoObserver.observe(video);
  });

  // Dynamic import for gallery
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', async () => {
        const { initializeGallery } = await import('./gallery.js');
        initializeGallery();
      }, { once: true }); // Ensure the import only happens once
    });
  }

  // 動画プレビューセクションのクリックイベント (index.html用)
  const videoPreviewImage = document.querySelector(".video-preview-image");
  if (videoPreviewImage) {
    videoPreviewImage.addEventListener("click", function () {
      window.location.href = "mv.html";
    });
  }

  // 最適化されたアニメーション
  const elementsToAnimate = document.querySelectorAll(
    ".spot-card, .gallery-item, .about-content, .access-content, .content-section",
  );

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          animationObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    },
  );

  elementsToAnimate.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    animationObserver.observe(element);
  });

  // ハンバーガーメニューの制御
  const hamburger = document.querySelector(".hamburger");
  const navContainer = document.querySelector(".nav-container");
  const navLinks = document.querySelectorAll(".nav-links a");

  // ハンバーガーメニューのトグル
  hamburger.addEventListener("click", function () {
    this.classList.toggle("is-active");
    navContainer.classList.toggle("is-active");
  });

  // メニューリンクをクリックしたときにメニューを閉じる
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-active");
      navContainer.classList.remove("is-active");
    });
  });

  // 画面外クリックでメニューを閉じる
  document.addEventListener("click", function (event) {
    if (
      !hamburger.contains(event.target) &&
      !navContainer.contains(event.target)
    ) {
      hamburger.classList.remove("is-active");
      navContainer.classList.remove("is-active");
    }
  });

  // インラインonclickの代替処理
  document.querySelectorAll("[data-scroll-target]").forEach((element) => {
    element.addEventListener("click", function () {
      const targetId = this.getAttribute("data-scroll-target");
      scrollToSection(targetId);
    });
  });
}); // DOMContentLoaded 終了

// セクションへのスムーズスクロール (グローバル関数)
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

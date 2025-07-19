class LandingI18n {
  constructor() {
    this.currentLanguage = 'ru'; // По умолчанию русский
    this.translations = {
      ru: {
        // Навигация
        download: 'Скачать',

        // Герой секция
        hero_title: 'Поймай любой цвет',
        hero_title_accent: 'одним кликом',
        hero_subtitle:
          'Chrome расширение для мгновенного захвата цветов с любой веб-страницы. Получай HEX, RGB, HSL коды за секунду!',
        install_free: 'Установить бесплатно',
        try_demo: 'Попробовать демо',
        how_it_works: 'Как работает',
        pick_color: 'Поймать цвет',

        // Возможности
        features_title: 'Возможности',
        feature_instant_title: 'Мгновенный захват',
        feature_instant_desc:
          'Один клик — и все форматы цвета готовы. Кликни на нужный формат, чтобы скопировать.',
        feature_formats_title: 'Все форматы',
        feature_formats_desc:
          'HEX, RGB, HSL — получай цвет в трех основных форматах сразу.',
        feature_history_title: 'История цветов',
        feature_history_desc:
          'Автоматически сохраняй последние цвета. Никогда не потеряешь нужный оттенок.',
        feature_hotkeys_title: 'Горячие клавиши',
        feature_hotkeys_desc:
          'Ctrl+Shift+X для мгновенного запуска. Работай ещё быстрее!',
        feature_languages_title: 'Два языка',
        feature_languages_desc:
          'Полная поддержка русского и английского языков в интерфейсе.',
        feature_lightweight_title: 'Легковесность',
        feature_lightweight_desc:
          'Минимальное потребление ресурсов. Работает быстро и не тормозит браузер.',

        // Как это работает
        how_it_works_title: 'Как это работает',
        step1_title: 'Установи расширение',
        step1_desc: 'Скачай ColorSnap из Chrome Web Store за несколько секунд.',
        step2_title: 'Кликни на иконку',
        step2_desc:
          'Открой расширение и нажми "Поймать цвет" или используй Ctrl+Shift+X.',
        step3_title: 'Выбери цвет',
        step3_desc:
          'Кликни по любому элементу на странице — получи все форматы и скопируй нужный!',

        // Скачивание
        download_title: 'Скачай ColorSnap прямо сейчас',
        download_subtitle:
          'Бесплатно, безопасно и без рекламы. Работает в Chrome, Edge, Brave и других Chromium браузерах.',
        download_chrome: 'Установить из Chrome Web Store',
        current_version: 'Текущая версия',
        free: 'Бесплатно',
        rating: 'Рейтинг',

        // Футер
        footer_description: 'Лучший инструмент для захвата цветов в Chrome',
        product: 'Продукт',
        features: 'Возможности',
        support: 'Поддержка',
        privacy_policy: 'Политика конфиденциальности',
        contact: 'Связаться',
        made_with_love: 'Made with ❤️ for creativity',
        demo_instruction:
          'Кликни на любой элемент страницы чтобы "поймать" его цвет!',
      },
      en: {
        // Navigation
        download: 'Download',

        // Hero section
        hero_title: 'Catch any color',
        hero_title_accent: 'with one click',
        hero_subtitle:
          'Chrome extension for instant color capturing from any web page. Get HEX, RGB, HSL codes in a second!',
        install_free: 'Install for Free',
        try_demo: 'Try Demo',
        how_it_works: 'How It Works',
        pick_color: 'Pick Color',

        // Features
        features_title: 'Features',
        feature_instant_title: 'Instant Capture',
        feature_instant_desc:
          'One click and all color formats are ready. Click on the format you need to copy.',
        feature_formats_title: 'All Formats',
        feature_formats_desc:
          'HEX, RGB, HSL — get color in three essential formats instantly.',
        feature_history_title: 'Color History',
        feature_history_desc:
          'Automatically save recent colors. Never lose the perfect shade again.',
        feature_hotkeys_title: 'Hotkeys',
        feature_hotkeys_desc:
          'Ctrl+Shift+X for instant launch. Work even faster!',
        feature_languages_title: 'Two Languages',
        feature_languages_desc:
          'Full support for Russian and English interface.',
        feature_lightweight_title: 'Lightweight',
        feature_lightweight_desc:
          'Minimal resource consumption. Fast performance without slowing your browser.',

        // How it works
        how_it_works_title: 'How It Works',
        step1_title: 'Install Extension',
        step1_desc: 'Download ColorSnap from Chrome Web Store in seconds.',
        step2_title: 'Click the Icon',
        step2_desc:
          'Open the extension and click "Pick Color" or use Ctrl+Shift+X.',
        step3_title: 'Choose Color',
        step3_desc:
          'Click on any element on the page — get all formats and copy what you need!',

        // Download
        download_title: 'Download ColorSnap Right Now',
        download_subtitle:
          'Free, secure and ad-free. Works in Chrome, Edge, Brave and other Chromium browsers.',
        download_chrome: 'Install from Chrome Web Store',
        current_version: 'Current Version',
        free: 'Free',
        rating: 'Rating',

        // Footer
        footer_description: 'The best color picker tool for Chrome',
        product: 'Product',
        features: 'Features',
        support: 'Support',
        privacy_policy: 'Privacy Policy',
        contact: 'Contact',
        made_with_love: 'Made with ❤️ for creativity',
        demo_instruction: 'Click on any page element to "catch" its color!',
      },
    };

    this.loadLanguage();
  }

  // Загрузка сохраненного языка из localStorage
  loadLanguage() {
    try {
      const savedLanguage = localStorage.getItem('colorsnap_landing_language');
      this.currentLanguage = savedLanguage || this.detectBrowserLanguage();
    } catch (error) {
      console.warn('Не удалось загрузить язык из localStorage:', error);
      this.currentLanguage = this.detectBrowserLanguage();
    }
  }

  // Определение языка браузера
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ru')) {
      return 'ru';
    }
    return 'en';
  }

  // Сохранение выбранного языка
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      try {
        localStorage.setItem('colorsnap_landing_language', language);
      } catch (error) {
        console.warn('Не удалось сохранить язык:', error);
      }
      this.updatePageTexts();
      this.updateLanguageToggle();
      this.updateHtmlLang();
    }
  }

  // Получение перевода
  t(key) {
    const translation = this.translations[this.currentLanguage];
    return translation && translation[key] ? translation[key] : key;
  }

  // Получение текущего языка
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Переключение языка
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
    this.setLanguage(newLanguage);
  }

  // Обновление переключателя языка
  updateLanguageToggle() {
    const toggleBtn = document.getElementById('languageToggle');
    if (toggleBtn) {
      const textElement = toggleBtn.querySelector('.language-toggle__text');
      if (textElement) {
        textElement.textContent = this.currentLanguage === 'ru' ? 'EN' : 'RU';
      }
    }
  }

  // Обновление атрибута lang в HTML
  updateHtmlLang() {
    document.documentElement.lang = this.currentLanguage;
  }

  // Обновление всех текстов на странице
  updatePageTexts() {
    // Найти все элементы с атрибутом data-i18n и обновить их
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (element.hasAttribute('data-i18n-placeholder')) {
        element.placeholder = translation;
      } else if (element.hasAttribute('data-i18n-title')) {
        element.title = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Обновить title страницы
    this.updatePageTitle();
  }

  // Обновление title страницы
  updatePageTitle() {
    const titles = {
      ru: 'ColorSnap - Поймай любой цвет одним кликом 🎨',
      en: 'ColorSnap - Catch any color with one click 🎨',
    };
    document.title = titles[this.currentLanguage];

    // Обновить meta description
    const descriptions = {
      ru: 'Chrome расширение для захвата цветов с веб-страниц. Получай HEX, RGB, HSL коды мгновенно!',
      en: 'Chrome extension for capturing colors from web pages. Get HEX, RGB, HSL codes instantly!',
    };

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descriptions[this.currentLanguage]);
    }
  }

  // Инициализация после загрузки DOM
  init() {
    this.updatePageTexts();
    this.updateLanguageToggle();
    this.updateHtmlLang();

    // Добавить обработчик клика на переключатель языка
    const toggleBtn = document.getElementById('languageToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }
  }
}

// Глобальный экземпляр i18n
window.landingI18n = new LandingI18n();

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  window.landingI18n.init();
});

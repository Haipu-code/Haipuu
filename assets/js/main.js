/**
 * Lưu Tuấn Hải Portfolio - Core Interactions & Logic
 * Includes Pride Aura Switcher, Bilingual System, Interactive Quiz, Audio Chimes & Forms
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // AUDIO SYNTHESIZER (Cosmic Chimes via Web Audio API)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playCosmicChime(frequency = 587.33, duration = 0.35) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      // Soft arpeggio slide
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback not permitted or supported:', e);
    }
  }

  // --------------------------------------------------------------------------
  // PRIDE AURA THEME CONTROLLER
  // --------------------------------------------------------------------------
  const auraBtn = document.getElementById('aura-btn');
  const auraMenu = document.getElementById('aura-menu');
  const auraOptions = document.querySelectorAll('.aura-option');

  function setPrideAura(auraName) {
    if (auraName === 'rainbow') {
      document.documentElement.removeAttribute('data-aura');
    } else {
      document.documentElement.setAttribute('data-aura', auraName);
    }

    auraOptions.forEach(opt => {
      opt.classList.toggle('selected', opt.getAttribute('data-value') === auraName);
    });

    localStorage.setItem('tuanhai-pride-aura', auraName);
    playCosmicChime(659.25, 0.4); // E5 note
  }

  if (auraBtn && auraMenu) {
    auraBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      auraMenu.classList.toggle('show');
      playCosmicChime(523.25, 0.2); // C5
    });

    document.addEventListener('click', () => {
      auraMenu.classList.remove('show');
    });

    auraOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-value');
        setPrideAura(val);
        auraMenu.classList.remove('show');
      });
    });

    // Initialize saved aura
    const savedAura = localStorage.getItem('tuanhai-pride-aura') || 'rainbow';
    setPrideAura(savedAura);
  }

  // Sound Toggle Button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
      soundBtn.classList.toggle('muted', !soundEnabled);
      if (soundEnabled) {
        playCosmicChime(880, 0.3);
      }
    });
  }

  // --------------------------------------------------------------------------
  // BILINGUAL LOCALIZATION DICTIONARY (VI / EN)
  // --------------------------------------------------------------------------
  const translations = {
    vi: {
      "nav-about": "Về tôi",
      "nav-education": "Học vấn",
      "nav-services": "Khóa học",
      "nav-experience": "Kinh nghiệm",
      "nav-quiz": "Lộ trình học",
      "nav-contact": "Liên hệ",
      "nav-cta": "Đặt lịch tư vấn",
      "hero-badge": "✨ English Tutor & Educational Creator",
      "hero-title-prefix": "Xin chào, tôi là",
      "hero-title-name": "Lưu Tuấn Hải",
      "hero-subtitle": "✦ Gia Sư Tiếng Anh Cấp 1, Cấp 2 | FTU Chất Lượng Cao",
      "hero-description": "Đồng hành cùng các bạn học sinh tìm lại niềm vui và sự say mê tiếng Anh. Hệ thống kiến thức cốt lõi vững chắc, thành thạo kỹ năng giải đề, tự tin bứt phá điểm 8+, 9+, 10 trong các bài thi và kỳ thi chuyển cấp.",
      "hero-cta-explore": "🚀 Khám phá lộ trình",
      "hero-cta-contact": "💬 Tư vấn học tập",
      "stat-ielts": "7.5 IELTS",
      "stat-ielts-sub": "Listening 8.5 | Reading 7.5",
      "stat-grade10": "Điểm 10.0",
      "stat-grade10-sub": "Tuyển sinh 10 & Miễn thi THPTQG",
      "stat-ftu": "3.49 / 4.0",
      "stat-ftu-sub": "FTU Quản trị KD Quốc tế CLC",
      "stat-experience": "2+ Năm",
      "stat-experience-sub": "Biên soạn học thuật & Mentor",

      "about-sub": "Triết lý giảng dạy & Giá trị cốt lõi",
      "about-title": "Mỗi học sinh là một vì sao mang dải màu riêng biệt",
      "about-desc": "Em tin rằng việc học ngoại ngữ không nên là áp lực hay nhồi nhét máy móc. Bằng sự kiên nhẫn, gần gũi và một không gian học tập an toàn, tôn trọng bản sắc của từng em, việc học tiếng Anh sẽ trở thành hành trình khám phá đầy tự tin và hứng khởi.",
      "philo-1-title": "Kiên nhẫn & Truyền cảm hứng",
      "philo-1-desc": "Lắng nghe tâm lý học sinh, biến những cấu trúc ngữ pháp khô khan thành câu chuyện sinh động và dễ ghi nhớ.",
      "philo-2-title": "Lộ trình học tập cá nhân hóa",
      "philo-2-desc": "Thiết kế giáo án dựa trên năng lực thực tế, điểm mạnh và điểm yếu riêng biệt của từng bạn học sinh.",
      "philo-3-title": "Môi trường học tập cởi mở & Tôn trọng (Safe Space)",
      "philo-3-desc": "Khuyến khích các em tự do đặt câu hỏi, không sợ mắc lỗi sai, tôn trọng sự đa dạng và nuôi dưỡng sự tự tin của trẻ.",
      "philo-4-title": "Đồng hành chặt chẽ cùng phụ huynh",
      "philo-4-desc": "Cập nhật báo cáo tiến độ chi tiết định kỳ sau mỗi tuần/tháng, tư vấn tâm lý thi cử cho học sinh.",

      "skills-academic-title": "📚 Kỹ Năng Chuyên Môn Cốt Lõi",
      "skills-pedagogy-title": "🌱 Kỹ Năng Sư Phạm & Phương Pháp",
      "skills-tools-title": "💻 Công Cụ & Số Hóa Bài Giảng",

      "edu-sub": "Hành trình học tập & Dấu ấn xuất sắc",
      "edu-title": "Trình Độ Học Vấn & Thành Tích",
      "edu-desc": "Nền tảng học thuật vững chắc là bảo chứng cao nhất cho chất lượng kiến thức và phương pháp truyền thụ.",

      "services-sub": "Các gói gia sư & Lộ trình đào tạo",
      "services-title": "Các Chương Trình Học Trọng Tâm",
      "services-desc": "Lộ trình được thiết kế chuẩn mực theo chương trình của Bộ Giáo dục & chuẩn khảo thí quốc tế.",

      "exp-sub": "Kinh nghiệm thực chiến & Sáng tạo nội dung",
      "exp-title": "Kinh Nghiệm Làm Việc & Hoạt Động",
      "exp-desc": "Kinh nghiệm quản lý bộ phận Marketing học thuật và hoạt động ngoại khóa tại các câu lạc bộ uy tín.",

      "quiz-sub": "Công cụ gợi ý lộ trình",
      "quiz-title": "Khám Phá Lộ Trình Phù Hợp Cho Con",
      "quiz-desc": "Chọn cấp lớp, mức điểm hiện tại và mục tiêu để nhận ngay phân tích và lộ trình học tập tối ưu.",

      "contact-sub": "Kết nối & Đồng hành",
      "contact-title": "Đặt Lịch Học Thử & Tư Vấn Miễn Phí",
      "contact-desc": "Liên hệ trực tiếp với thầy Hải để nhận buổi đánh giá năng lực đầu vào hoàn toàn miễn phí.",
      "form-name": "Họ và tên Phụ huynh / Học sinh",
      "form-phone": "Số điện thoại / Zalo",
      "form-grade": "Học sinh lớp mấy?",
      "form-goal": "Mục tiêu học tập",
      "form-note": "Ghi chú thêm về học lực hoặc mong muốn",
      "form-submit": "Gửi Đăng Ký Tư Vấn ✦"
    },
    en: {
      "nav-about": "About",
      "nav-education": "Education",
      "nav-services": "Services",
      "nav-experience": "Experience",
      "nav-quiz": "Study Path",
      "nav-contact": "Contact",
      "nav-cta": "Book Free Session",
      "hero-badge": "✨ English Tutor & Educational Creator",
      "hero-title-prefix": "Hello, I am",
      "hero-title-name": "Hai Luu (Luu Tuan Hai)",
      "hero-subtitle": "✦ English Tutor for Primary & Secondary School | FTU Honors",
      "hero-description": "Inspiring young learners to rediscover the joy and magic of English. Mastering core grammatical systems, exam strategies, and reaching top 8+, 9+, 10 scores with personalized mentorship in an inclusive, safe environment.",
      "hero-cta-explore": "🚀 Explore Tracks",
      "hero-cta-contact": "💬 Get In Touch",
      "stat-ielts": "7.5 IELTS",
      "stat-ielts-sub": "Listening 8.5 | Reading 7.5",
      "stat-grade10": "10.0 Perfect",
      "stat-grade10-sub": "Grade 10 Exam & High School Exemption",
      "stat-ftu": "3.49 / 4.0",
      "stat-ftu-sub": "Foreign Trade University (FTU Honors)",
      "stat-experience": "2+ Years",
      "stat-experience-sub": "Academic Content & Mentorship",

      "about-sub": "Teaching Philosophy & Core Values",
      "about-title": "Every Student is a Star in Their Own Cosmic Spectrum",
      "about-desc": "Language learning should never feel like robotic memorization or high-pressure drills. Through patience, approachable energy, and a safe, inclusive space celebrating individuality, English becomes a journey of authentic self-expression and confidence.",
      "philo-1-title": "Patience & Inspiration",
      "philo-1-desc": "Attuned to child psychology, turning abstract grammar into captivating stories and intuitive memory anchors.",
      "philo-2-title": "Personalized Study Roadmaps",
      "philo-2-desc": "Custom lesson plans tailored precisely to each learner's unique strengths, challenges, and speed.",
      "philo-3-title": "Inclusive & Safe Space Learning",
      "philo-3-desc": "An encouraging environment where children are never afraid to make mistakes and individuality is respected.",
      "philo-4-title": "Parental Partnership",
      "philo-4-desc": "Detailed periodic reports sent to parents tracking weekly milestones, homework feedback, and exam mindset.",

      "skills-academic-title": "📚 Core Academic Competencies",
      "skills-pedagogy-title": "🌱 Pedagogical Methods & Soft Skills",
      "skills-tools-title": "💻 Digital Tools & Interactive Materials",

      "edu-sub": "Academic Excellence & Milestones",
      "edu-title": "Education & Academic Track Record",
      "edu-desc": "A continuous track record of academic distinction backing up solid teaching methodologies.",

      "services-sub": "Tutoring Packages & Curricula",
      "services-title": "Core Teaching Programs",
      "services-desc": "Structured curricula aligned with National Curriculum standards and international English benchmarks.",

      "exp-sub": "Leadership & Educational Content Creation",
      "exp-title": "Experience & Extracurricular Activities",
      "exp-desc": "Hands-on experience leading academic marketing teams and community translation projects.",

      "quiz-sub": "Interactive Path Finder",
      "quiz-title": "Find the Ideal Study Path for Your Child",
      "quiz-desc": "Select the current grade, present score, and learning goal to receive an optimal recommendation.",

      "contact-sub": "Get in Touch & Consult",
      "contact-title": "Schedule a Free Diagnostic Session",
      "contact-desc": "Reach out directly to discuss personalized tutoring and schedule a complimentary placement test.",
      "form-name": "Parent / Student Name",
      "form-phone": "Phone Number / Zalo",
      "form-grade": "Current Grade Level",
      "form-goal": "Target Learning Goal",
      "form-note": "Additional Notes / Learning Style",
      "form-submit": "Send Consultation Request ✦"
    }
  };

  let currentLang = localStorage.getItem('tuanhai-lang') || 'vi';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tuanhai-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.textContent = lang === 'vi' ? '🌐 VI / EN' : '🌐 EN / VI';
    }

    // Update input placeholders
    if (lang === 'en') {
      updatePlaceholder('#parent-name', 'e.g., Sarah Johnson / Hai Nguyen');
      updatePlaceholder('#parent-phone', 'e.g., 0353 266 206');
      updatePlaceholder('#parent-note', 'Tell me about current grades, challenges, or goals...');
    } else {
      updatePlaceholder('#parent-name', 'Ví dụ: Chị Lan / Anh Minh');
      updatePlaceholder('#parent-phone', 'Ví dụ: 0353 266 206');
      updatePlaceholder('#parent-note', 'Chia sẻ thêm về tình hình học tập hoặc kỳ vọng của phụ huynh...');
    }
  }

  function updatePlaceholder(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('placeholder', text);
  }

  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'vi' ? 'en' : 'vi';
      applyLanguage(nextLang);
      playCosmicChime(783.99, 0.25); // G5
    });
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE STUDY PATH FINDER QUIZ
  // --------------------------------------------------------------------------
  const quizGrade = document.getElementById('quiz-grade');
  const quizScore = document.getElementById('quiz-score');
  const quizGoal = document.getElementById('quiz-goal');
  const quizResult = document.getElementById('quiz-result');
  const quizResultTitle = document.getElementById('quiz-result-title');
  const quizResultDesc = document.getElementById('quiz-result-desc');
  const quizResultTag = document.getElementById('quiz-result-tag');

  function calculateStudyPath() {
    if (!quizGrade || !quizScore || !quizGoal || !quizResult) return;

    const grade = quizGrade.value;
    const score = quizScore.value;
    const goal = quizGoal.value;

    let recTitle = '';
    let recTag = '';
    let recDesc = '';

    if (grade === 'grade-9' || goal === 'target-10') {
      recTag = currentLang === 'vi' ? '⭐ Gói Luyện Thi Vào 10 Chuyên Sâu' : '⭐ Intensive Grade 10 Entrance Exam Prep';
      recTitle = currentLang === 'vi' ? 'Chiến Thuật Bứt Phá Điểm 9+, 10 Vào 10' : 'High-Stakes Mastery for 9+ & 10 Scores';
      recDesc = currentLang === 'vi'
        ? 'Phù hợp nhất cho học sinh lớp 9 chuẩn bị kỳ thi vào 10 công lập & chuyên. Lộ trình tập trung: Quét sạch 100% chuyên đề ngữ pháp trọng tâm, thành thạo kỹ năng xử lý các bẫy khó (Phrasal Verbs, Idioms, Điền từ, Đọc hiểu), rèn tư duy làm bài tốc độ cao với bộ đề độc quyền.'
        : 'Specifically designed for Grade 9 students targeting top public and specialized high schools. Focuses on full grammar systematization, advanced trick identification, vocabulary mastery, and rapid mock test drills.';
    } else if (grade === 'primary') {
      recTag = currentLang === 'vi' ? '🌱 Gói Khởi Động Tiềm Năng Cấp 1 (Lớp 3 - 5)' : '🌱 Primary Foundations (Grades 3 - 5)';
      recTitle = currentLang === 'vi' ? 'Xây Nền Tảng Chuẩn & Khơi Niềm Yêu Thích' : 'Solid Fundamentals & Joy of English';
      recDesc = currentLang === 'vi'
        ? 'Dành cho học sinh Tiểu học. Phương pháp học trực quan bằng hình ảnh, giáo án số hóa sinh động. Giúp bé tự tin phát âm chuẩn IPA, làm giàu vốn từ vựng theo chủ đề gần gũi, đạt điểm 10 tuyệt đối các bài kiểm tra và chuẩn bị thi vào lớp 6 CLC.'
        : 'Perfect for Grades 3-5 young learners. Visual, interactive digital lessons that spark natural curiosity, establish standard IPA pronunciation, expand core vocabulary, and build exam confidence.';
    } else {
      if (score === 'low') {
        recTag = currentLang === 'vi' ? '🛡️ Gói Lấy Lại Gốc Siêu Tốc & Tự Tin' : '🛡️ Fast-Track Foundation Recovery';
        recTitle = currentLang === 'vi' ? 'Gỡ Bỏ Rào Cản & Bù Đắp Lỗ Hổng Ngữ Pháp' : 'Rebuilding Foundations & Exam Confidence';
        recDesc = currentLang === 'vi'
          ? 'Kèm 1-1 kiên nhẫn từng bước. Hệ thống lại các thì động từ, cấu trúc câu căn bản, xóa tan nỗi sợ học tiếng Anh và nâng điểm kiểm tra trên lớp lên 8.0+ chỉ sau 8 - 12 tuần.'
          : 'Patient 1-on-1 mentorship targeting core grammatical gaps, essential sentence patterns, and rebuilding steady exam confidence up to 8.0+ within 8-12 weeks.';
      } else {
        recTag = currentLang === 'vi' ? '🚀 Gói Bứt Phá Cấp 2 Chuyên Sâu (Lớp 6 - 8)' : '🚀 Advanced Secondary Mastery (Grades 6 - 8)';
        recTitle = currentLang === 'vi' ? 'Nâng Cấp Kỹ Năng Đọc Hiểu & Từ Vựng Học Thuật' : 'Academic Reading & Grammar Elevation';
        recDesc = currentLang === 'vi'
          ? 'Mở rộng vốn từ học thuật phong phú, giải đề theo chuẩn cấu trúc đề thi khảo sát của Sở GD&ĐT, chuẩn bị bệ phóng vững chắc cho năm học lớp 9.'
          : 'Expands rich academic vocabulary, masters deep reading comprehension, and solves standard exam papers with ease.';
      }
    }

    quizResultTag.textContent = recTag;
    quizResultTitle.textContent = recTitle;
    quizResultDesc.textContent = recDesc;
    quizResult.classList.add('active');
  }

  if (quizGrade && quizScore && quizGoal) {
    [quizGrade, quizScore, quizGoal].forEach(select => {
      select.addEventListener('change', () => {
        calculateStudyPath();
        playCosmicChime(698.46, 0.2); // F5
      });
    });
    calculateStudyPath();
  }

  // --------------------------------------------------------------------------
  // ONE-CLICK COPY TO CLIPBOARD & TOAST
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    playCosmicChime(1046.50, 0.3); // C6 high bell
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(currentLang === 'vi' ? `Đã sao chép: ${textToCopy}` : `Copied: ${textToCopy}`);
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // CONSULTATION FORM SUBMISSION
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('consultation-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('parent-name').value.trim();
      const parentPhone = document.getElementById('parent-phone').value.trim();

      if (!parentName || !parentPhone) {
        showToast(currentLang === 'vi' ? 'Vui lòng nhập tên và số điện thoại!' : 'Please enter your name and phone number!');
        return;
      }

      showToast(currentLang === 'vi'
        ? `Cảm ơn ${parentName}! Thầy Hải sẽ liên hệ qua SĐT ${parentPhone} trong vòng 24h.`
        : `Thank you, ${parentName}! Hai Luu will contact you at ${parentPhone} within 24 hours.`
      );

      bookingForm.reset();
      playCosmicChime(1174.66, 0.4); // D6 victory chime
    });
  }

  // --------------------------------------------------------------------------
  // MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Initial language setup
  applyLanguage(currentLang);
})();

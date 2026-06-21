(function () {
  "use strict";

  const STORAGE_KEY = "aneeq-medical-study-state-v1";
  const SYNC_TABLES = {
    favorites: "favorites",
    highlights: "highlights",
    testResults: "test_results",
    translations: "translations",
    settings: "settings",
  };

  const LANGUAGES = [
    { code: "en", label: "English", native: "English" },
    { code: "ur", label: "Urdu", native: "Urdu" },
    { code: "ar", label: "Arabic", native: "Arabic" },
    { code: "es", label: "Spanish", native: "Espanol" },
    { code: "fr", label: "French", native: "Francais" },
  ];

  const QBANKS = [
    {
      id: "step1-core",
      title: "USMLE Step 1 Core",
      questions: 8,
      size: "148 MB",
      region: "Germany",
      subjects: ["Cardiology", "Infectious Disease", "Renal", "Pharmacology"],
      description: "Foundational pathology, physiology, microbiology, and pharmacology.",
    },
    {
      id: "clinical-medicine",
      title: "Clinical Medicine Review",
      questions: 6,
      size: "96 MB",
      region: "USA",
      subjects: ["Emergency", "Endocrine", "Pulmonary"],
      description: "Case-based clinical reasoning for shelf and board exams.",
    },
    {
      id: "rapid-recall",
      title: "Rapid Recall Incorrects",
      questions: 4,
      size: "42 MB",
      region: "Asia",
      subjects: ["Mixed"],
      description: "Short review set for spaced repetition and weak areas.",
    },
  ];

  const QUESTIONS = [
    {
      id: 101,
      qbankId: "step1-core",
      subject: "Cardiology",
      difficulty: 3,
      sourceRef: "NBME style block 1",
      stem:
        "A 22-year-old man develops fever, a new holosystolic murmur, and painless macules on his palms after intravenous drug use. Blood cultures grow Staphylococcus aureus. Which cardiac structure is most likely infected?",
      choices: [
        "Aortic valve",
        "Mitral valve",
        "Tricuspid valve",
        "Pulmonic valve",
        "Interventricular septum",
      ],
      correctIndex: 2,
      explanation:
        "Intravenous drug use most commonly causes right-sided infective endocarditis because injected organisms enter the venous circulation first. Staphylococcus aureus frequently infects the tricuspid valve.",
      incorrectExplanations: [
        "Aortic valve disease is common in older patients or congenital bicuspid valves, not the classic IV drug use pattern.",
        "Mitral valve involvement occurs in left-sided endocarditis but is less likely in this vignette.",
        "Correct.",
        "Pulmonic valve endocarditis is uncommon.",
        "The septum is not the typical site of valvular vegetation.",
      ],
      tags: ["endocarditis", "murmur", "microbiology"],
    },
    {
      id: 102,
      qbankId: "step1-core",
      subject: "Renal",
      difficulty: 2,
      sourceRef: "UWorld style renal",
      stem:
        "A patient with diabetic nephropathy has efferent arteriole constriction. What happens to glomerular filtration pressure and filtration fraction?",
      choices: [
        "Both decrease",
        "Both increase",
        "Pressure decreases and filtration fraction increases",
        "Pressure increases and filtration fraction decreases",
        "No change in either value",
      ],
      correctIndex: 1,
      explanation:
        "Moderate efferent arteriole constriction raises glomerular capillary hydrostatic pressure and increases filtration fraction because renal plasma flow falls more than GFR.",
      incorrectExplanations: [
        "This would fit afferent arteriole constriction.",
        "Correct.",
        "Glomerular pressure rises, not falls.",
        "Filtration fraction rises because plasma flow decreases.",
        "Afferent and efferent tone directly alter filtration dynamics.",
      ],
      tags: ["renal physiology", "diabetes"],
    },
    {
      id: 103,
      qbankId: "step1-core",
      subject: "Infectious Disease",
      difficulty: 4,
      sourceRef: "Microbiology drill",
      stem:
        "A child develops a pseudomembrane in the throat and myocarditis. The pathogen's toxin inhibits protein synthesis by modifying elongation factor 2. Which vaccine prevents this disease?",
      choices: ["MMR", "DTaP", "Hib", "IPV", "PCV13"],
      correctIndex: 1,
      explanation:
        "Corynebacterium diphtheriae produces an AB exotoxin that ADP-ribosylates EF-2. The diphtheria toxoid component of DTaP induces neutralizing antibodies.",
      incorrectExplanations: [
        "MMR covers measles, mumps, and rubella.",
        "Correct.",
        "Hib prevents Haemophilus influenzae type b disease.",
        "IPV prevents poliovirus.",
        "PCV13 protects against pneumococcal disease.",
      ],
      tags: ["vaccine", "toxin", "pediatrics"],
    },
    {
      id: 104,
      qbankId: "clinical-medicine",
      subject: "Emergency",
      difficulty: 3,
      sourceRef: "Emergency medicine case",
      stem:
        "A 64-year-old woman presents with sudden tearing chest pain radiating to the back. Blood pressure is 190/110 mm Hg. Which medication should be given first?",
      choices: ["Nitroprusside", "Labetalol", "Aspirin", "Heparin", "Alteplase"],
      correctIndex: 1,
      explanation:
        "Suspected aortic dissection requires immediate beta-blockade to reduce shear stress before vasodilators. Labetalol lowers heart rate and blood pressure.",
      incorrectExplanations: [
        "Vasodilators before beta-blockade can trigger reflex tachycardia and worsen dissection.",
        "Correct.",
        "Aspirin is useful for ACS but does not address dissection shear stress.",
        "Anticoagulation may be harmful in dissection.",
        "Thrombolysis is contraindicated when dissection is suspected.",
      ],
      tags: ["aortic dissection", "hypertension"],
    },
    {
      id: 105,
      qbankId: "step1-core",
      subject: "Pharmacology",
      difficulty: 2,
      sourceRef: "Pharm mechanism",
      stem:
        "A drug that treats hyperlipidemia causes flushing that improves with aspirin. Which pathway is directly inhibited by this drug?",
      choices: [
        "HMG-CoA reductase",
        "Pancreatic lipase",
        "Adipose tissue lipolysis",
        "NPC1L1 cholesterol transporter",
        "Bile acid reabsorption",
      ],
      correctIndex: 2,
      explanation:
        "Niacin causes prostaglandin-mediated flushing and lowers VLDL synthesis by inhibiting hormone-sensitive lipase in adipose tissue.",
      incorrectExplanations: [
        "Statins inhibit HMG-CoA reductase.",
        "Orlistat inhibits pancreatic lipase.",
        "Correct.",
        "Ezetimibe blocks NPC1L1.",
        "Cholestyramine blocks bile acid reabsorption.",
      ],
      tags: ["lipids", "niacin"],
    },
    {
      id: 106,
      qbankId: "clinical-medicine",
      subject: "Endocrine",
      difficulty: 4,
      sourceRef: "Endocrine emergency",
      stem:
        "A patient with fatigue, hyperpigmentation, hyponatremia, hyperkalemia, and hypotension has low cortisol that does not rise after cosyntropin. What is the diagnosis?",
      choices: [
        "Secondary adrenal insufficiency",
        "Primary adrenal insufficiency",
        "Cushing syndrome",
        "SIADH",
        "Conn syndrome",
      ],
      correctIndex: 1,
      explanation:
        "Primary adrenal insufficiency causes low cortisol, high ACTH with hyperpigmentation, mineralocorticoid deficiency, hyponatremia, hyperkalemia, and poor cosyntropin response.",
      incorrectExplanations: [
        "Secondary disease usually has low ACTH and preserved aldosterone.",
        "Correct.",
        "Cushing syndrome causes cortisol excess.",
        "SIADH does not cause hyperkalemia or hyperpigmentation.",
        "Conn syndrome causes hypertension and hypokalemia.",
      ],
      tags: ["adrenal", "electrolytes"],
    },
  ];

  const BOOKS = [
    {
      id: "cardiology-handbook",
      title: "Cardiology Handbook",
      lastPosition: "front",
      chapters: [
        {
          id: "front",
          title: "Front of Book",
          nodes: [
            {
              type: "heading",
              level: 2,
              text: "High-yield cardiac murmurs",
            },
            {
              type: "paragraph",
              text:
                "Systolic murmurs include aortic stenosis, hypertrophic cardiomyopathy, mitral regurgitation, and tricuspid regurgitation. Always connect the murmur timing with bedside maneuvers.",
            },
            {
              type: "clinicalBox",
              title: "Clinical Box: Endocarditis clue",
              text:
                "Fever plus a new murmur after intravenous drug use should immediately raise concern for tricuspid valve endocarditis due to Staphylococcus aureus.",
            },
          ],
        },
        {
          id: "dissection",
          title: "Aortic dissection",
          nodes: [
            {
              type: "heading",
              level: 2,
              text: "Aortic dissection management",
            },
            {
              type: "paragraph",
              text:
                "Initial management is heart-rate control with intravenous beta blockers. Add vasodilators only after beta blockade if blood pressure remains elevated.",
            },
            {
              type: "list",
              items: [
                "Tearing chest pain radiating to the back",
                "Pulse deficit or neurologic symptoms",
                "Widened mediastinum can appear on chest radiograph",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "renal-notes",
      title: "Renal Physiology Notes",
      lastPosition: "front",
      chapters: [
        {
          id: "front",
          title: "Filtration basics",
          nodes: [
            {
              type: "heading",
              level: 2,
              text: "Glomerular Starling forces",
            },
            {
              type: "paragraph",
              text:
                "Afferent arteriole constriction lowers renal plasma flow and GFR. Moderate efferent arteriole constriction raises glomerular hydrostatic pressure and increases filtration fraction.",
            },
            {
              type: "clinicalBox",
              title: "Clinical Box: ACE inhibitors",
              text:
                "ACE inhibitors dilate the efferent arteriole, which can lower intraglomerular pressure and protect diabetic kidneys over time.",
            },
          ],
        },
      ],
    },
  ];

  const DEFAULT_SETTINGS = {
    hideListOnSelect: true,
    collapseSearchResults: false,
    lockFullscreen: true,
    enableSwipeDeleteFavorites: true,
    collapsingToolbar: true,
    openTablesAsPopup: true,
    documentLoadingAnimation: true,
    useLastRedHighlight: false,
    systemFont: true,
    justifyText: false,
    downloadRegion: "Germany",
    openLastTopicAfterCrash: true,
  };

  const GLOSSARY = {
    ur: {
      fever: "bukhar",
      inflammation: "soozish",
      kidney: "gurda",
      heart: "dil",
      endocarditis: "endocarditis",
      valve: "valve",
      cortisol: "cortisol",
    },
    ar: {
      fever: "humma",
      inflammation: "iltihab",
      kidney: "kilya",
      heart: "qalb",
      endocarditis: "endocarditis",
      valve: "sammam",
      cortisol: "cortisol",
    },
    es: {
      fever: "fiebre",
      inflammation: "inflamacion",
      kidney: "rinon",
      heart: "corazon",
      endocarditis: "endocarditis",
      valve: "valvula",
      cortisol: "cortisol",
    },
    fr: {
      fever: "fievre",
      inflammation: "inflammation",
      kidney: "rein",
      heart: "coeur",
      endocarditis: "endocarditis",
      valve: "valve",
      cortisol: "cortisol",
    },
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultState() {
    return {
      route: "dashboard",
      selectedLanguage: "en",
      downloads: {
        "step1-core": { downloaded: true, progress: 100 },
        "clinical-medicine": { downloaded: true, progress: 100 },
        "rapid-recall": { downloaded: false, progress: 0 },
      },
      favorites: [101],
      flagged: [104],
      highlights: [
        {
          id: "h-101-1",
          questionId: 101,
          color: "yellow",
          text: "right-sided infective endocarditis",
          note: "IV drug use points to tricuspid valve.",
          createdAt: new Date().toISOString(),
        },
      ],
      questionHistory: {},
      attempts: [],
      translations: {},
      syncQueue: [],
      settings: clone(DEFAULT_SETTINGS),
      activeSession: null,
      activeQuestionIndex: 0,
      activeBookId: BOOKS[0].id,
      activeChapterId: BOOKS[0].chapters[0].id,
      searchQuery: "",
      customContent: {
        qbanks: [],
        questions: [],
        books: [],
        importedAt: null,
      },
      auth: {
        currentUserId: null,
        accounts: [],
      },
    };
  }

  function mergeState(savedState) {
    const defaults = createDefaultState();
    return {
      ...defaults,
      ...savedState,
      downloads: { ...defaults.downloads, ...(savedState.downloads || {}) },
      settings: { ...defaults.settings, ...(savedState.settings || {}) },
      questionHistory: {
        ...defaults.questionHistory,
        ...(savedState.questionHistory || {}),
      },
      translations: { ...defaults.translations, ...(savedState.translations || {}) },
      customContent: {
        ...defaults.customContent,
        ...(savedState.customContent || {}),
      },
      auth: {
        ...defaults.auth,
        ...(savedState.auth || {}),
        accounts: Array.isArray(savedState.auth && savedState.auth.accounts)
          ? savedState.auth.accounts
          : [],
      },
    };
  }

  function loadState() {
    if (typeof localStorage === "undefined") {
      return createDefaultState();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? mergeState(JSON.parse(raw)) : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }

  function saveState(state) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function getCurrentUser(state) {
    return (state.auth.accounts || []).find(
      (account) => account.id === state.auth.currentUserId,
    );
  }

  function isAdmin(state) {
    const user = getCurrentUser(state);
    return Boolean(user && user.role === "admin");
  }

  function createAccount(state, formData) {
    const name = String(formData.name || "").trim();
    const email = normalizeEmail(formData.email);
    const password = String(formData.password || "");
    const role = formData.role === "admin" ? "admin" : "user";

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }
    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters for this demo.");
    }
    if ((state.auth.accounts || []).some((account) => account.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const account = {
      id: `account-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    state.auth.accounts.push(account);
    state.auth.currentUserId = account.id;
    queueSync(state, "accounts", "INSERT", {
      id: account.id,
      email: account.email,
      role: account.role,
    });
    return account;
  }

  function loginAccount(state, formData) {
    const email = normalizeEmail(formData.email);
    const password = String(formData.password || "");
    const account = (state.auth.accounts || []).find(
      (item) => item.email === email && item.password === password,
    );
    if (!account) {
      throw new Error("Invalid email or password.");
    }
    state.auth.currentUserId = account.id;
    return account;
  }

  function logoutAccount(state) {
    state.auth.currentUserId = null;
    state.route = "dashboard";
    state.activeSession = null;
  }

  function mergeById(baseItems, customItems) {
    const merged = new Map();
    baseItems.forEach((item) => merged.set(String(item.id), item));
    customItems.forEach((item) => merged.set(String(item.id), item));
    return [...merged.values()];
  }

  function getCustomContent(state) {
    return {
      qbanks: Array.isArray(state.customContent && state.customContent.qbanks)
        ? state.customContent.qbanks
        : [],
      questions: Array.isArray(state.customContent && state.customContent.questions)
        ? state.customContent.questions
        : [],
      books: Array.isArray(state.customContent && state.customContent.books)
        ? state.customContent.books
        : [],
      importedAt: state.customContent && state.customContent.importedAt,
    };
  }

  function getAllQBanks(state) {
    return mergeById(QBANKS, getCustomContent(state || {}).qbanks);
  }

  function getAllQuestions(state) {
    return mergeById(QUESTIONS, getCustomContent(state || {}).questions);
  }

  function getAllBooks(state) {
    return mergeById(BOOKS, getCustomContent(state || {}).books);
  }

  function normalizeAdminPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Admin upload must be a JSON object.");
    }

    const qbanks = Array.isArray(payload.qbanks) ? payload.qbanks : [];
    const questions = Array.isArray(payload.questions) ? payload.questions : [];
    const books = Array.isArray(payload.books) ? payload.books : [];

    if (qbanks.length === 0 && questions.length === 0 && books.length === 0) {
      throw new Error("JSON must include at least one of: qbanks, questions, or books.");
    }

    return {
      qbanks: qbanks.map(normalizeQBank),
      questions: questions.map(normalizeQuestion),
      books: books.map(normalizeBook),
      importedAt: new Date().toISOString(),
    };
  }

  function normalizeQBank(bank) {
    if (!bank || typeof bank !== "object") {
      throw new Error("Each qbank must be an object.");
    }
    if (!bank.id || !bank.title) {
      throw new Error("Each qbank needs id and title.");
    }

    return {
      id: String(bank.id),
      title: String(bank.title),
      questions: Number(bank.questions || 0),
      size: String(bank.size || "Custom upload"),
      region: String(bank.region || "Admin"),
      subjects: Array.isArray(bank.subjects) ? bank.subjects.map(String) : [],
      description: String(bank.description || "Uploaded by admin."),
    };
  }

  function normalizeQuestion(question) {
    if (!question || typeof question !== "object") {
      throw new Error("Each question must be an object.");
    }
    if (!question.id || !question.qbankId || !question.stem) {
      throw new Error("Each question needs id, qbankId, and stem.");
    }
    if (!Array.isArray(question.choices) || question.choices.length < 2) {
      throw new Error(`Question ${question.id} needs at least two choices.`);
    }

    const correctIndex = Number(question.correctIndex);
    if (
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= question.choices.length
    ) {
      throw new Error(`Question ${question.id} has an invalid correctIndex.`);
    }

    return {
      id: Number(question.id),
      qbankId: String(question.qbankId),
      subject: String(question.subject || "General"),
      difficulty: Number(question.difficulty || 1),
      sourceRef: String(question.sourceRef || question.source_ref || "Admin upload"),
      stem: String(question.stem),
      choices: question.choices.map(String),
      correctIndex,
      explanation: String(question.explanation || ""),
      incorrectExplanations: Array.isArray(question.incorrectExplanations)
        ? question.incorrectExplanations.map(String)
        : question.choices.map((_, index) =>
            index === correctIndex ? "Correct." : "Review the explanation.",
          ),
      tags: Array.isArray(question.tags) ? question.tags.map(String) : [],
    };
  }

  function normalizeBook(book) {
    if (!book || typeof book !== "object") {
      throw new Error("Each book must be an object.");
    }
    if (!book.id || !book.title || !Array.isArray(book.chapters)) {
      throw new Error("Each book needs id, title, and chapters.");
    }

    return {
      id: String(book.id),
      title: String(book.title),
      lastPosition: String(book.lastPosition || book.chapters[0].id || "front"),
      chapters: book.chapters.map((chapter) => ({
        id: String(chapter.id),
        title: String(chapter.title),
        nodes: Array.isArray(chapter.nodes)
          ? chapter.nodes.map((node) => ({
              type: String(node.type || "paragraph"),
              level: Number(node.level || 2),
              title: node.title ? String(node.title) : undefined,
              text: node.text ? String(node.text) : "",
              items: Array.isArray(node.items) ? node.items.map(String) : undefined,
            }))
          : [],
      })),
    };
  }

  function importAdminContent(state, payload, mode = "merge") {
    const normalized = normalizeAdminPayload(payload);
    const current = mode === "replace" ? createDefaultState().customContent : getCustomContent(state);
    state.customContent = {
      qbanks: mergeById(current.qbanks, normalized.qbanks),
      questions: mergeById(current.questions, normalized.questions),
      books: mergeById(current.books, normalized.books),
      importedAt: normalized.importedAt,
    };

    normalized.qbanks.forEach((bank) => {
      state.downloads[bank.id] = { downloaded: true, progress: 100 };
    });

    queueSync(state, "admin_content", "UPSERT", {
      qbanks: normalized.qbanks.length,
      questions: normalized.questions.length,
      books: normalized.books.length,
      mode,
    });
    return state.customContent;
  }

  function queueSync(state, tableName, op, payload) {
    state.syncQueue.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      tableName,
      op,
      payload,
      createdAt: new Date().toISOString(),
    });
  }

  function getDownloadedQuestionIds(state) {
    const downloaded = new Set(
      Object.entries(state.downloads)
        .filter(([, entry]) => entry.downloaded)
        .map(([id]) => id),
    );
    return getAllQuestions(state).filter((question) => downloaded.has(question.qbankId)).map(
      (question) => question.id,
    );
  }

  function getQuestionById(questionId, state) {
    return getAllQuestions(state || createDefaultState()).find(
      (question) => question.id === Number(questionId),
    );
  }

  function getQuestionStatus(question, state) {
    const history = state.questionHistory[question.id];
    if (!history) {
      return "unused";
    }
    return history.isCorrect ? "correct" : "incorrect";
  }

  function uniqueSubjects(state) {
    return [...new Set(getAllQuestions(state || createDefaultState()).map((question) => question.subject))].sort();
  }

  function filterQuestions(state, filters = {}) {
    const downloadedIds = new Set(getDownloadedQuestionIds(state));
    let results = getAllQuestions(state).filter((question) => downloadedIds.has(question.id));

    if (filters.subject && filters.subject !== "All") {
      results = results.filter((question) => question.subject === filters.subject);
    }

    if (filters.difficulty && filters.difficulty !== "All") {
      results = results.filter(
        (question) => question.difficulty === Number(filters.difficulty),
      );
    }

    if (filters.status && filters.status !== "all") {
      results = results.filter((question) => {
        if (filters.status === "favorites") {
          return state.favorites.includes(question.id);
        }
        if (filters.status === "flagged") {
          return state.flagged.includes(question.id);
        }
        if (filters.status === "due") {
          return isDueForReview(question, state);
        }
        return getQuestionStatus(question, state) === filters.status;
      });
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((question) =>
        [
          question.stem,
          question.explanation,
          question.subject,
          question.sourceRef,
          question.tags.join(" "),
          question.choices.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    if (filters.count && filters.count !== "custom") {
      results = results.slice(0, Number(filters.count));
    }

    return results;
  }

  function createStudySession(state, options = {}) {
    const questions = filterQuestions(state, options);
    const count =
      options.count === "custom" && options.customQuestionIds
        ? options.customQuestionIds.split(",").map((value) => Number(value.trim()))
        : questions.map((question) => question.id);
    const qids = count
      .filter((questionId) => getQuestionById(questionId, state))
      .slice(0, options.count === "custom" ? undefined : Number(options.count || 10));

    if (qids.length === 0) {
      throw new Error("No questions match the selected filters.");
    }

    state.activeSession = {
      id: `session-${Date.now()}`,
      mode: options.mode || "tutor",
      startedAt: new Date().toISOString(),
      qids,
      answers: {},
      completedAt: null,
    };
    state.activeQuestionIndex = 0;
    state.route = "reader";
    return state.activeSession;
  }

  function answerActiveQuestion(state, choiceIndex, elapsedSec = 0) {
    const session = state.activeSession;
    if (!session) {
      throw new Error("No active session.");
    }

    const questionId = session.qids[state.activeQuestionIndex];
    const question = getQuestionById(questionId, state);
    const isCorrect = Number(choiceIndex) === question.correctIndex;
    session.answers[questionId] = {
      choiceIndex: Number(choiceIndex),
      isCorrect,
      timeSec: elapsedSec,
      answeredAt: new Date().toISOString(),
    };
    state.questionHistory[questionId] = {
      isCorrect,
      lastChoiceIndex: Number(choiceIndex),
      lastAnsweredAt: new Date().toISOString(),
      nextReviewAt: nextReviewDate(isCorrect).toISOString(),
    };
    queueSync(state, SYNC_TABLES.testResults, "UPSERT", {
      questionId,
      choiceIndex: Number(choiceIndex),
      isCorrect,
    });
    return session.answers[questionId];
  }

  function scoreSession(session, questions = QUESTIONS) {
    const questionMap = new Map(questions.map((question) => [question.id, question]));
    const results = session.qids.map((questionId) => {
      const answer = session.answers[questionId];
      const question = questionMap.get(questionId);
      return {
        questionId,
        subject: question.subject,
        chosenIndex: answer ? answer.choiceIndex : null,
        correctIndex: question.correctIndex,
        isCorrect: Boolean(answer && answer.isCorrect),
        timeSec: answer ? answer.timeSec : 0,
      };
    });
    const correct = results.filter((result) => result.isCorrect).length;
    const answered = results.filter((result) => result.chosenIndex !== null).length;
    return {
      total: session.qids.length,
      answered,
      correct,
      incorrect: answered - correct,
      percent: session.qids.length
        ? Math.round((correct / session.qids.length) * 100)
        : 0,
      averageTimeSec: answered
        ? Math.round(
            results.reduce((sum, result) => sum + result.timeSec, 0) / answered,
          )
        : 0,
      results,
    };
  }

  function finishSession(state) {
    if (!state.activeSession) {
      throw new Error("No active session.");
    }

    state.activeSession.completedAt = new Date().toISOString();
    const score = scoreSession(state.activeSession, getAllQuestions(state));
    state.attempts.unshift({
      id: state.activeSession.id,
      completedAt: state.activeSession.completedAt,
      mode: state.activeSession.mode,
      qids: [...state.activeSession.qids],
      score,
    });
    state.route = "score";
    queueSync(state, SYNC_TABLES.testResults, "INSERT", state.attempts[0]);
    return score;
  }

  function nextReviewDate(isCorrect) {
    const date = new Date();
    date.setDate(date.getDate() + (isCorrect ? 7 : 1));
    return date;
  }

  function isDueForReview(question, state, now = new Date()) {
    const history = state.questionHistory[question.id];
    return Boolean(history && history.nextReviewAt && new Date(history.nextReviewAt) <= now);
  }

  function toggleValue(list, value) {
    const normalized = Number(value);
    return list.includes(normalized)
      ? list.filter((item) => item !== normalized)
      : [...list, normalized];
  }

  function toggleFavorite(state, questionId) {
    state.favorites = toggleValue(state.favorites, questionId);
    queueSync(state, SYNC_TABLES.favorites, "UPSERT", {
      questionId: Number(questionId),
      saved: state.favorites.includes(Number(questionId)),
    });
  }

  function toggleFlag(state, questionId) {
    state.flagged = toggleValue(state.flagged, questionId);
  }

  function addHighlight(state, questionId, color, text, note) {
    const highlight = {
      id: `highlight-${Date.now()}`,
      questionId: Number(questionId),
      color,
      text,
      note,
      createdAt: new Date().toISOString(),
    };
    state.highlights.unshift(highlight);
    queueSync(state, SYNC_TABLES.highlights, "INSERT", highlight);
    return highlight;
  }

  function hashText(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function translateText(state, sourceText, targetLanguage) {
    if (!sourceText || targetLanguage === "en") {
      return sourceText;
    }

    const sourceHash = hashText(sourceText);
    const key = `${sourceHash}:${targetLanguage}`;
    if (state.translations[key]) {
      return state.translations[key].translated;
    }

    const glossary = GLOSSARY[targetLanguage] || {};
    let translated = sourceText;
    Object.entries(glossary).forEach(([english, replacement]) => {
      const pattern = new RegExp(`\\b${english}\\b`, "gi");
      translated = translated.replace(
        pattern,
        `${replacement} (${english})`,
      );
    });

    const language = LANGUAGES.find((item) => item.code === targetLanguage);
    translated = `[${language ? language.native : targetLanguage} translation draft] ${translated}`;
    state.translations[key] = {
      sourceHash,
      lang: targetLanguage,
      translated,
      createdAt: new Date().toISOString(),
    };
    queueSync(state, SYNC_TABLES.translations, "UPSERT", state.translations[key]);
    return translated;
  }

  function cycleTranslationLanguage(state) {
    const codes = LANGUAGES.map((language) => language.code);
    const currentIndex = codes.indexOf(state.selectedLanguage);
    state.selectedLanguage = codes[(currentIndex + 1) % codes.length] || "en";
    return state.selectedLanguage;
  }

  function searchContent(state, query) {
    const term = String(query || "").trim().toLowerCase();
    if (!term) {
      return [];
    }

    const questionHits = filterQuestions(state, { query: term }).map((question) => ({
      type: "question",
      id: question.id,
      title: `Question ${question.id}: ${question.subject}`,
      body: `${question.stem} ${question.explanation}`,
    }));

    const bookHits = getAllBooks(state).flatMap((book) =>
      book.chapters.flatMap((chapter) =>
        chapter.nodes
          .map((node) => {
            const body =
              node.text || (node.items ? node.items.join(" ") : "") || node.title || "";
            return { book, chapter, body };
          })
          .filter((hit) => hit.body.toLowerCase().includes(term))
          .map((hit) => ({
            type: "book",
            id: `${hit.book.id}:${hit.chapter.id}`,
            title: `${hit.book.title} - ${hit.chapter.title}`,
            body: hit.body,
          })),
      ),
    );

    return [...questionHits, ...bookHits];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function highlightText(value, query) {
    const safe = escapeHtml(value);
    if (!query) {
      return safe;
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp(`(${escapedQuery})`, "gi"), "<mark>$1</mark>");
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function averageAccuracy(state) {
    const answered = Object.values(state.questionHistory);
    if (answered.length === 0) {
      return 0;
    }
    const correct = answered.filter((entry) => entry.isCorrect).length;
    return Math.round((correct / answered.length) * 100);
  }

  function renderMetric(label, value, detail = "") {
    return `
      <article class="card metric">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
      </article>
    `;
  }

  function renderDashboard(state) {
    const downloadedCount = Object.values(state.downloads).filter(
      (entry) => entry.downloaded,
    ).length;
    const dueCount = getAllQuestions(state).filter((question) => isDueForReview(question, state)).length;
    const lastAttempt = state.attempts[0];
    return `
      <section class="grid">
        ${renderMetric("Downloaded banks", downloadedCount, "Available fully offline")}
        ${renderMetric("Answered", Object.keys(state.questionHistory).length, "Questions with local history")}
        ${renderMetric("Accuracy", `${averageAccuracy(state)}%`, "Across answered questions")}
        ${renderMetric("Due review", dueCount, "Wrong answers resurface first")}
      </section>

      <section class="grid two">
        <article class="card">
          <h2>Continue studying</h2>
          <p>Pick up a tutor session, search downloaded content, or open a reference chapter.</p>
          <div class="actions">
            <button class="btn" data-route-target="test">Create custom test</button>
            <button class="ghost" data-route-target="search">Search content</button>
            <button class="ghost" data-route-target="books">Open books</button>
          </div>
        </article>
        <article class="card">
          <h2>Latest score</h2>
          ${
            lastAttempt
              ? `<div class="score-circle" style="--score: ${lastAttempt.score.percent}%"><strong>${lastAttempt.score.percent}%</strong></div>
                 <p>${lastAttempt.score.correct} correct of ${lastAttempt.score.total} questions. Average ${lastAttempt.score.averageTimeSec}s per question.</p>`
              : "<p>No finished tests yet. Create a tutor or timed session to generate analytics.</p>"
          }
        </article>
      </section>

      <section class="card">
        <h2>Weak subject trends</h2>
        <div class="list">
          ${uniqueSubjects(state)
            .map((subject) => {
              const answered = Object.entries(state.questionHistory)
                .map(([questionId, history]) => ({
                  question: getQuestionById(questionId, state),
                  history,
                }))
                .filter((entry) => entry.question && entry.question.subject === subject);
              const correct = answered.filter((entry) => entry.history.isCorrect).length;
              const percent = answered.length
                ? Math.round((correct / answered.length) * 100)
                : 0;
              return `
                <div class="list-item">
                  <div class="list-item-header">
                    <strong>${escapeHtml(subject)}</strong>
                    <span class="tag ${percent < 60 && answered.length ? "red" : "blue"}">${percent}%</span>
                  </div>
                  <div class="progress-track"><div class="progress-bar" style="width: ${percent}%"></div></div>
                </div>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function renderQBank(state) {
    return `
      <section class="card">
        <h2>QBank browser</h2>
        <p>Browse licensed QBanks. Downloaded banks are available without network access.</p>
        <div class="list">
          ${getAllQBanks(state).map((bank) => {
            const download = state.downloads[bank.id] || { downloaded: false, progress: 0 };
            return `
              <article class="list-item">
                <div class="list-item-header">
                  <div>
                    <h3>${escapeHtml(bank.title)}</h3>
                    <p>${escapeHtml(bank.description)}</p>
                  </div>
                  <span class="tag ${download.downloaded ? "blue" : "orange"}">${
                    download.downloaded ? "Downloaded" : "Store"
                  }</span>
                </div>
                <div class="pill-row">
                  <span class="pill">${bank.questions} questions</span>
                  <span class="pill">${escapeHtml(bank.size)}</span>
                  <span class="pill">${escapeHtml(bank.region)}</span>
                  ${bank.subjects
                    .map((subject) => `<span class="pill">${escapeHtml(subject)}</span>`)
                    .join("")}
                </div>
                <div class="progress-track">
                  <div class="progress-bar" style="width: ${download.progress}%"></div>
                </div>
                <div class="actions">
                  <button class="${download.downloaded ? "ghost" : "btn"}" data-download="${bank.id}">
                    ${download.downloaded ? "Refresh download" : "Download for offline"}
                  </button>
                  <button class="ghost" data-route-target="test">Create test</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderTestCreator(state) {
    return `
      <section class="card">
        <h2>Custom test creator</h2>
        <p>Choose count, mode, subject, difficulty, and question status just like the guide describes.</p>
        <form id="test-form">
          <div class="grid">
            <label>
              Question count
              <select name="count">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="custom">Custom QIDs</option>
              </select>
            </label>
            <label>
              Mode
              <select name="mode">
                <option value="tutor">Tutor</option>
                <option value="timed">Timed</option>
                <option value="reading">Reading</option>
              </select>
            </label>
            <label>
              Subject
              <select name="subject">
                <option>All</option>
                ${uniqueSubjects(state)
                  .map((subject) => `<option>${escapeHtml(subject)}</option>`)
                  .join("")}
              </select>
            </label>
            <label>
              Difficulty
              <select name="difficulty">
                <option>All</option>
                <option value="1">1 - Easy</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 - Hard</option>
              </select>
            </label>
            <label>
              Filter
              <select name="status">
                <option value="all">All downloaded</option>
                <option value="unused">Unused only</option>
                <option value="incorrect">Incorrect only</option>
                <option value="flagged">Flagged only</option>
                <option value="favorites">Favorites only</option>
                <option value="due">Due for review</option>
              </select>
            </label>
            <label>
              Custom QIDs
              <input name="customQuestionIds" placeholder="101, 104, 106" />
            </label>
          </div>
          <button class="btn" type="submit">Start test</button>
        </form>
      </section>
    `;
  }

  function renderReader(state) {
    if (!state.activeSession) {
      return `
        <section class="card">
          <h2>No active test</h2>
          <p>Create a test to open the question reader.</p>
          <button class="btn" data-route-target="test">Create test</button>
        </section>
      `;
    }

    const session = state.activeSession;
    const questionId = session.qids[state.activeQuestionIndex];
    const question = getQuestionById(questionId, state);
    const answer = session.answers[question.id];
    const translatedStem = translateText(
      state,
      question.stem,
      state.selectedLanguage,
    );
    const relatedHighlights = state.highlights.filter(
      (highlight) => highlight.questionId === question.id,
    );
    const progress = Math.round(((state.activeQuestionIndex + 1) / session.qids.length) * 100);
    return `
      <section class="reader-layout">
        <article class="card">
          <div class="list-item-header">
            <div>
              <span class="tag blue">${escapeHtml(question.subject)}</span>
              <span class="tag">Difficulty ${question.difficulty}</span>
              <h2>Question ${state.activeQuestionIndex + 1} of ${session.qids.length}</h2>
            </div>
            <div class="actions">
              <button class="icon-button" title="Translate question" data-cycle-translation>
                TR
              </button>
              <button class="icon-button" title="Ask AI tutor" data-ai-explain="${question.id}">
                AI
              </button>
              <button class="ghost" data-toggle-favorite="${question.id}">
                ${state.favorites.includes(question.id) ? "Unfavorite" : "Favorite"}
              </button>
              <button class="ghost" data-toggle-flag="${question.id}">
                ${state.flagged.includes(question.id) ? "Unflag" : "Flag"}
              </button>
            </div>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width: ${progress}%"></div></div>
          <p class="question-stem">${escapeHtml(question.stem)}</p>
          ${
            state.selectedLanguage !== "en"
              ? `<div class="translation-box">
                  <strong>Translated banner: ${escapeHtml(
                    LANGUAGES.find((item) => item.code === state.selectedLanguage).native,
                  )}</strong>
                  <p>${escapeHtml(translatedStem)}</p>
                  <small>Original English stays visible above for medical terminology safety.</small>
                </div>`
              : ""
          }
          <div class="list">
            ${question.choices
              .map((choice, index) => {
                const selected = answer && answer.choiceIndex === index;
                const resultClass = answer
                  ? index === question.correctIndex
                    ? " correct"
                    : selected
                      ? " incorrect"
                      : ""
                  : selected
                    ? " selected"
                    : "";
                return `
                  <button class="choice${resultClass}" data-answer="${index}">
                    <strong>${String.fromCharCode(65 + index)}.</strong>
                    <span>${escapeHtml(choice)}</span>
                    ${
                      answer
                        ? `<small>${escapeHtml(question.incorrectExplanations[index])}</small>`
                        : ""
                    }
                  </button>
                `;
              })
              .join("")}
          </div>
          ${
            answer
              ? `<div class="note-box"><strong>Explanation</strong><p>${escapeHtml(
                  question.explanation,
                )}</p></div>`
              : ""
          }
          <div class="actions">
            <button class="ghost" data-reader-prev>Previous</button>
            <button class="ghost" data-reader-next>Next</button>
            <button class="btn" data-finish-session>Finish test</button>
          </div>
        </article>

        <aside class="card">
          <h3>Highlights + notes</h3>
          <form id="highlight-form">
            <label>
              Highlight text
              <input name="text" value="${escapeHtml(question.tags[0] || "")}" />
            </label>
            <label>
              Color
              <select name="color">
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
              </select>
            </label>
            <label>
              Note
              <textarea name="note" placeholder="Attach your note"></textarea>
            </label>
            <button class="ghost" type="submit">Save highlight</button>
          </form>
          <div class="list">
            ${
              relatedHighlights.length
                ? relatedHighlights
                    .map(
                      (highlight) => `
                        <div class="list-item">
                          <span class="highlight-${escapeHtml(highlight.color)}">${escapeHtml(
                            highlight.text,
                          )}</span>
                          <p>${escapeHtml(highlight.note || "No note")}</p>
                        </div>
                      `,
                    )
                    .join("")
                : "<p>No highlights for this question yet.</p>"
            }
          </div>
          <div class="ai-box">
            <h3>AI tutor</h3>
            <p>${escapeHtml(buildTutorPrompt(question))}</p>
            <button class="ghost" data-ai-explain="${question.id}">Generate local tutor explanation</button>
          </div>
        </aside>
      </section>
    `;
  }

  function buildTutorPrompt(question) {
    return `Explain why answer ${String.fromCharCode(
      65 + question.correctIndex,
    )} is correct for this ${question.subject} question, and why the other choices are wrong.`;
  }

  function renderScore(state) {
    const attempt = state.attempts[0];
    if (!attempt) {
      return `
        <section class="card">
          <h2>No score yet</h2>
          <p>Finish a test session to review your results.</p>
        </section>
      `;
    }

    return `
      <section class="grid two">
        <article class="card">
          <h2>Post-test review</h2>
          <div class="score-circle" style="--score: ${attempt.score.percent}%">
            <strong>${attempt.score.percent}%</strong>
          </div>
          <p>${attempt.score.correct} correct, ${attempt.score.incorrect} incorrect, ${attempt.score.averageTimeSec}s average per question.</p>
          <div class="actions">
            <button class="btn" data-retake-incorrect>Retest incorrect</button>
            <button class="ghost" data-copy-qids="${attempt.qids.join(",")}">Copy all QIDs</button>
          </div>
        </article>
        <article class="card">
          <h2>Question results</h2>
          <div class="list">
            ${attempt.score.results
              .map((result) => {
                const question = getQuestionById(result.questionId, state);
                return `
                  <div class="list-item">
                    <div class="list-item-header">
                      <strong>Q${result.questionId} - ${escapeHtml(question.subject)}</strong>
                      <span class="tag ${result.isCorrect ? "blue" : "red"}">${
                        result.isCorrect ? "Correct" : "Incorrect"
                      }</span>
                    </div>
                    <p>${escapeHtml(question.stem)}</p>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      </section>
    `;
  }

  function renderSearch(state) {
    const hits = searchContent(state, state.searchQuery);
    return `
      <section class="card">
        <h2>Full-text search</h2>
        <label>
          Keyword
          <input id="search-input" value="${escapeHtml(
            state.searchQuery,
          )}" placeholder="Search questions, explanations, and books" autofocus />
        </label>
      </section>
      <section class="card">
        <h2>Results ${hits.length ? `(${hits.length})` : ""}</h2>
        <div class="list">
          ${
            hits.length
              ? hits
                  .map(
                    (hit) => `
                      <article class="list-item search-hit">
                        <div class="list-item-header">
                          <strong>${escapeHtml(hit.title)}</strong>
                          <span class="tag">${escapeHtml(hit.type)}</span>
                        </div>
                        <p>${highlightText(hit.body.slice(0, 360), state.searchQuery)}</p>
                      </article>
                    `,
                  )
                  .join("")
              : documentSafeEmptyState()
          }
        </div>
      </section>
    `;
  }

  function renderFavorites(state) {
    const favorites = state.favorites
      .map((questionId) => getQuestionById(questionId, state))
      .filter(Boolean);
    return `
      <section class="card">
        <h2>Saved favorites</h2>
        <p>Hearted questions stay available offline and sync through the queue.</p>
        <div class="list">
          ${
            favorites.length
              ? favorites
                  .map(
                    (question) => `
                      <article class="list-item">
                        <div class="list-item-header">
                          <strong>Q${question.id} - ${escapeHtml(question.subject)}</strong>
                          <button class="ghost" data-toggle-favorite="${question.id}">Remove</button>
                        </div>
                        <p>${escapeHtml(question.stem)}</p>
                      </article>
                    `,
                  )
                  .join("")
              : documentSafeEmptyState()
          }
        </div>
      </section>
    `;
  }

  function renderBooks(state) {
    const books = getAllBooks(state);
    const activeBook = books.find((book) => book.id === state.activeBookId) || books[0];
    const activeChapter =
      activeBook.chapters.find((chapter) => chapter.id === state.activeChapterId) ||
      activeBook.chapters[0];
    return `
      <section class="book-layout">
        <aside class="card toc">
          <h2>Reference books</h2>
          <label>
            Book
            <select id="book-select">
              ${books.map(
                (book) =>
                  `<option value="${book.id}" ${
                    book.id === activeBook.id ? "selected" : ""
                  }>${escapeHtml(book.title)}</option>`,
              ).join("")}
            </select>
          </label>
          <strong>Table of Contents</strong>
          ${activeBook.chapters
            .map(
              (chapter) => `
                <button data-chapter="${chapter.id}" class="${
                  chapter.id === activeChapter.id ? "active" : ""
                }">${escapeHtml(chapter.title)}</button>
              `,
            )
            .join("")}
        </aside>
        <article class="card book-page">
          <p class="eyebrow">Clinical content viewer</p>
          <h2>${escapeHtml(activeChapter.title)}</h2>
          ${activeChapter.nodes
            .map((node) => renderBookNode(node, state.selectedLanguage, state))
            .join("")}
        </article>
      </section>
    `;
  }

  function renderBookNode(node, language, state) {
    const translated =
      language !== "en" && node.text ? translateText(state, node.text, language) : "";
    if (node.type === "heading") {
      return `<h${node.level}>${escapeHtml(node.text)}</h${node.level}>`;
    }
    if (node.type === "clinicalBox") {
      return `
        <section class="clinical-box">
          <strong>${escapeHtml(node.title)}</strong>
          <p>${escapeHtml(node.text)}</p>
          ${translated ? `<p class="translation-box">${escapeHtml(translated)}</p>` : ""}
        </section>
      `;
    }
    if (node.type === "list") {
      return `<ul>${node.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    return `
      <p>${escapeHtml(node.text)}</p>
      ${translated ? `<div class="translation-box">${escapeHtml(translated)}</div>` : ""}
    `;
  }

  function renderDownloads(state) {
    return `
      <section class="card">
        <h2>Downloads manager</h2>
        <p>Files are represented as local packages in this MVP. Production apps should store downloaded SQLite DB files in the device documents directory.</p>
        <div class="list">
          ${getAllQBanks(state).map((bank) => {
            const download = state.downloads[bank.id] || { downloaded: false, progress: 0 };
            return `
              <article class="list-item">
                <div class="list-item-header">
                  <div>
                    <strong>${escapeHtml(bank.title)}</strong>
                    <p>${escapeHtml(bank.size)} from ${escapeHtml(
                      state.settings.downloadRegion,
                    )} region</p>
                  </div>
                  <span class="tag ${download.downloaded ? "blue" : "orange"}">${
                    download.downloaded ? "Installed" : "Available"
                  }</span>
                </div>
                <div class="progress-track"><div class="progress-bar" style="width: ${download.progress}%"></div></div>
                <button class="btn" data-download="${bank.id}">${
                  download.downloaded ? "Resume / verify" : "Download"
                }</button>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderSettings(state) {
    const labels = {
      hideListOnSelect: "Hide list on select",
      collapseSearchResults: "Collapse search/content results",
      lockFullscreen: "Lock in fullscreen",
      enableSwipeDeleteFavorites: "Enable swipe to delete favorites",
      collapsingToolbar: "Use collapsing toolbar",
      openTablesAsPopup: "Open tables as popup",
      documentLoadingAnimation: "New document loading animation",
      useLastRedHighlight: "Use last red highlight as starting point",
      systemFont: "Use default system font",
      justifyText: "Justify texts",
      openLastTopicAfterCrash: "Open last topic after crash",
    };
    return `
      <section class="card">
        <h2>Settings</h2>
        <label>
          Download server region
          <select id="region-select">
            ${["Germany", "USA", "Asia"]
              .map(
                (region) =>
                  `<option ${state.settings.downloadRegion === region ? "selected" : ""}>${region}</option>`,
              )
              .join("")}
          </select>
        </label>
        ${Object.entries(labels)
          .map(
            ([key, label]) => `
              <div class="setting-row">
                <div>
                  <strong>${escapeHtml(label)}</strong>
                  <p>Stored locally and queued for cross-device sync.</p>
                </div>
                <input type="checkbox" data-setting="${key}" ${
                  state.settings[key] ? "checked" : ""
                } />
              </div>
            `,
          )
          .join("")}
        <div class="actions">
          <button class="danger" data-reset-state>Reset demo data</button>
        </div>
      </section>
    `;
  }

  function renderAuth() {
    return `
      <section class="auth-layout">
        <article class="card auth-card">
          <p class="eyebrow">Create account</p>
          <h2>Admin or User account</h2>
          <p>Create an admin account to upload/manage data, or a user account to study.</p>
          <form id="create-account-form">
            <label>
              Full name
              <input name="name" autocomplete="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autocomplete="new-password" placeholder="Minimum 4 characters" required />
            </label>
            <label>
              Account type
              <select name="role">
                <option value="user">User / Student</option>
                <option value="admin">Admin / Data uploader</option>
              </select>
            </label>
            <button class="btn" type="submit">Create account</button>
          </form>
        </article>
        <article class="card auth-card">
          <p class="eyebrow">Login</p>
          <h2>Existing account</h2>
          <p>Accounts are stored locally in this MVP. Production builds should use Firebase or Supabase Auth.</p>
          <form id="login-form">
            <label>
              Email
              <input name="email" type="email" autocomplete="email" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autocomplete="current-password" required />
            </label>
            <button class="btn" type="submit">Login</button>
          </form>
        </article>
      </section>
    `;
  }

  function documentSafeEmptyState() {
    return `
      <div class="empty-state">
        <h3>No results yet</h3>
        <p>Try another filter, download another bank, or create a new session.</p>
      </div>
    `;
  }

  function renderAdmin(state) {
    if (!isAdmin(state)) {
      return `
        <section class="card">
          <h2>Admin access required</h2>
          <p>Create or login with an Admin account to upload QBank, question, and book data.</p>
          <button class="btn" data-logout>Switch account</button>
        </section>
      `;
    }

    const content = getCustomContent(state);
    const sample = {
      qbanks: [
        {
          id: "admin-cardiology",
          title: "Admin Cardiology Upload",
          questions: 1,
          size: "JSON",
          region: "Admin",
          subjects: ["Cardiology"],
          description: "Questions uploaded from the admin panel.",
        },
      ],
      questions: [
        {
          id: 9001,
          qbankId: "admin-cardiology",
          subject: "Cardiology",
          difficulty: 2,
          sourceRef: "Admin import",
          stem: "A patient has chest pain relieved by nitroglycerin. Which vessel is most often affected in classic angina?",
          choices: ["Left anterior descending artery", "Pulmonary artery", "Portal vein", "Renal artery"],
          correctIndex: 0,
          explanation: "Classic angina is usually due to coronary artery atherosclerosis; the LAD is commonly involved.",
          incorrectExplanations: ["Correct.", "Pulmonary disease causes different symptoms.", "Portal vein disease does not cause angina.", "Renal artery disease causes hypertension."],
          tags: ["angina", "coronary artery"],
        },
      ],
      books: [
        {
          id: "admin-notes",
          title: "Admin Uploaded Notes",
          chapters: [
            {
              id: "front",
              title: "Imported Chapter",
              nodes: [
                {
                  type: "heading",
                  level: 2,
                  text: "Admin content",
                },
                {
                  type: "paragraph",
                  text: "Paste your book paragraphs, clinical boxes, and lists into this JSON format.",
                },
              ],
            },
          ],
        },
      ],
    };

    return `
      <section class="grid two">
        <article class="card">
          <h2>Admin panel - upload data</h2>
          <p>Import QBanks, questions, and books as JSON. Uploaded content is saved locally on this device and appears in QBank, tests, search, and books.</p>
          <form id="admin-upload-form">
            <label>
              JSON file
              <input id="admin-file" type="file" accept="application/json,.json" />
            </label>
            <label>
              Paste JSON
              <textarea id="admin-json" name="json" placeholder="Paste qbanks/questions/books JSON here"></textarea>
            </label>
            <label>
              Import mode
              <select name="mode">
                <option value="merge">Merge with existing uploads</option>
                <option value="replace">Replace previous uploads</option>
              </select>
            </label>
            <div class="actions">
              <button class="btn" type="submit">Import data</button>
              <button class="ghost" type="button" data-export-admin>Export uploaded JSON</button>
              <button class="danger" type="button" data-clear-admin>Clear uploaded data</button>
            </div>
          </form>
        </article>
        <aside class="card">
          <h2>Uploaded content</h2>
          <div class="grid">
            ${renderMetric("QBanks", content.qbanks.length, "Admin uploads")}
            ${renderMetric("Questions", content.questions.length, "Imported items")}
            ${renderMetric("Books", content.books.length, "Reference uploads")}
          </div>
          <p>${content.importedAt ? `Last import: ${formatDate(content.importedAt)}` : "No admin upload yet."}</p>
        </aside>
      </section>
      <section class="card">
        <h2>JSON format example</h2>
        <p>You can send me screenshots/videos and I will convert the structure to match your exact app. For now, upload JSON using this format:</p>
        <pre>${escapeHtml(JSON.stringify(sample, null, 2))}</pre>
      </section>
    `;
  }

  function renderRoute(state) {
    switch (state.route) {
      case "qbank":
        return renderQBank(state);
      case "test":
        return renderTestCreator(state);
      case "reader":
        return renderReader(state);
      case "score":
        return renderScore(state);
      case "search":
        return renderSearch(state);
      case "favorites":
        return renderFavorites(state);
      case "books":
        return renderBooks(state);
      case "downloads":
        return renderDownloads(state);
      case "admin":
        return renderAdmin(state);
      case "settings":
        return renderSettings(state);
      case "dashboard":
      default:
        return renderDashboard(state);
    }
  }

  function pageTitle(route) {
    const titles = {
      dashboard: "Dashboard",
      qbank: "QBank Browser",
      test: "Create Test",
      reader: "Question Reader",
      score: "Score Review",
      search: "Search",
      favorites: "Favorites",
      books: "Reference Books",
      downloads: "Downloads",
      admin: "Admin Upload",
      settings: "Settings",
    };
    return titles[route] || "Dashboard";
  }

  function initializeBrowserApp() {
    const app = document.getElementById("app");
    const pageTitleNode = document.getElementById("page-title");
    const languageSelect = document.getElementById("language-select");
    const languagePicker = document.querySelector(".language-picker");
    const syncStatus = document.getElementById("sync-status");
    const accountStatus = document.getElementById("account-status");
    const logoutButton = document.getElementById("logout-button");
    const installButton = document.getElementById("install-button");
    let state = loadState();
    let installPrompt;

    function persistAndRender() {
      saveState(state);
      render();
    }

    function setRoute(route) {
      state.route = route;
      persistAndRender();
    }

    function render() {
      const currentUser = getCurrentUser(state);
      if (!currentUser) {
        pageTitleNode.textContent = "Account";
        app.innerHTML = renderAuth();
        syncStatus.textContent = "Create an Admin or User account to continue.";
        accountStatus.textContent = "Not logged in";
        logoutButton.classList.add("hidden");
        languagePicker.classList.add("hidden");
        document.querySelectorAll(".nav-link").forEach((button) => {
          button.classList.remove("active");
          button.disabled = true;
          button.classList.toggle("hidden", button.dataset.route === "admin");
        });
        return;
      }

      if (state.route === "admin" && !isAdmin(state)) {
        state.route = "dashboard";
      }

      pageTitleNode.textContent = pageTitle(state.route);
      app.innerHTML = renderRoute(state);
      syncStatus.textContent = `${state.syncQueue.length} local change${
        state.syncQueue.length === 1 ? "" : "s"
      } waiting for online sync.`;
      accountStatus.textContent = `${currentUser.name} (${currentUser.role})`;
      logoutButton.classList.remove("hidden");
      languagePicker.classList.toggle("hidden", state.route !== "reader");
      document.querySelectorAll(".nav-link").forEach((button) => {
        button.disabled = false;
        button.classList.toggle("hidden", button.dataset.route === "admin" && !isAdmin(state));
        button.classList.toggle("active", button.dataset.route === state.route);
      });
      languageSelect.value = state.selectedLanguage;
    }

    LANGUAGES.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.native;
      languageSelect.append(option);
    });

    document.querySelector(".nav-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-route]");
      if (button) {
        if (!getCurrentUser(state)) {
          alert("Create or login to an account first.");
          return;
        }
        setRoute(button.dataset.route);
      }
    });

    logoutButton.addEventListener("click", () => {
      logoutAccount(state);
      persistAndRender();
    });

    languageSelect.addEventListener("change", () => {
      state.selectedLanguage = languageSelect.value;
      persistAndRender();
    });

    app.addEventListener("submit", (event) => {
      if (event.target.id === "create-account-form") {
        event.preventDefault();
        const formData = formDataToObject(new FormData(event.target));
        try {
          createAccount(state, formData);
          persistAndRender();
        } catch (error) {
          alert(error.message);
        }
      }

      if (event.target.id === "login-form") {
        event.preventDefault();
        const formData = formDataToObject(new FormData(event.target));
        try {
          loginAccount(state, formData);
          persistAndRender();
        } catch (error) {
          alert(error.message);
        }
      }

      if (event.target.id === "test-form") {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
          createStudySession(state, formDataToObject(formData));
          persistAndRender();
        } catch (error) {
          alert(error.message);
        }
      }

      if (event.target.id === "highlight-form") {
        event.preventDefault();
        const formData = new FormData(event.target);
        const questionId = state.activeSession.qids[state.activeQuestionIndex];
        addHighlight(
          state,
          questionId,
          formData.get("color"),
          formData.get("text"),
          formData.get("note"),
        );
        persistAndRender();
      }

      if (event.target.id === "admin-upload-form") {
        event.preventDefault();
        if (!isAdmin(state)) {
          alert("Admin account required.");
          return;
        }
        const formData = new FormData(event.target);
        const rawJson = String(formData.get("json") || "").trim();
        if (!rawJson) {
          alert("Choose a JSON file or paste JSON first.");
          return;
        }

        try {
          importAdminContent(
            state,
            JSON.parse(rawJson),
            String(formData.get("mode") || "merge"),
          );
          persistAndRender();
          alert("Admin data imported successfully.");
        } catch (error) {
          alert(error.message);
        }
      }
    });

    app.addEventListener("input", (event) => {
      if (event.target.id === "search-input") {
        state.searchQuery = event.target.value;
        saveState(state);
        app.innerHTML = renderSearch(state);
        const input = document.getElementById("search-input");
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });

    app.addEventListener("change", (event) => {
      if (event.target.matches("[data-setting]")) {
        const key = event.target.dataset.setting;
        state.settings[key] = event.target.checked;
        queueSync(state, SYNC_TABLES.settings, "UPSERT", {
          key,
          value: event.target.checked,
        });
        persistAndRender();
      }

      if (event.target.id === "region-select") {
        state.settings.downloadRegion = event.target.value;
        queueSync(state, SYNC_TABLES.settings, "UPSERT", {
          key: "downloadRegion",
          value: event.target.value,
        });
        persistAndRender();
      }

      if (event.target.id === "book-select") {
        state.activeBookId = event.target.value;
        const book = getAllBooks(state).find((item) => item.id === state.activeBookId);
        state.activeChapterId = book.chapters[0].id;
        persistAndRender();
      }

      if (event.target.id === "admin-file") {
        const file = event.target.files && event.target.files[0];
        if (!file) {
          return;
        }

        file.text().then((text) => {
          const textarea = document.getElementById("admin-json");
          if (textarea) {
            textarea.value = text;
          }
        });
      }
    });

    app.addEventListener("click", async (event) => {
      const routeButton = event.target.closest("[data-route-target]");
      if (routeButton) {
        setRoute(routeButton.dataset.routeTarget);
        return;
      }

      const downloadButton = event.target.closest("[data-download]");
      if (downloadButton) {
        const bankId = downloadButton.dataset.download;
        state.downloads[bankId] = { downloaded: true, progress: 100 };
        queueSync(state, "downloads", "UPSERT", { qbankId: bankId, downloaded: true });
        persistAndRender();
        return;
      }

      const favoriteButton = event.target.closest("[data-toggle-favorite]");
      if (favoriteButton) {
        toggleFavorite(state, favoriteButton.dataset.toggleFavorite);
        persistAndRender();
        return;
      }

      const flagButton = event.target.closest("[data-toggle-flag]");
      if (flagButton) {
        toggleFlag(state, flagButton.dataset.toggleFlag);
        persistAndRender();
        return;
      }

      const answerButton = event.target.closest("[data-answer]");
      if (answerButton) {
        answerActiveQuestion(state, answerButton.dataset.answer, 72);
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-reader-prev]")) {
        state.activeQuestionIndex = Math.max(0, state.activeQuestionIndex - 1);
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-reader-next]")) {
        state.activeQuestionIndex = Math.min(
          state.activeSession.qids.length - 1,
          state.activeQuestionIndex + 1,
        );
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-finish-session]")) {
        finishSession(state);
        persistAndRender();
        return;
      }

      const chapterButton = event.target.closest("[data-chapter]");
      if (chapterButton) {
        state.activeChapterId = chapterButton.dataset.chapter;
        persistAndRender();
        return;
      }

      const aiButton = event.target.closest("[data-ai-explain]");
      if (aiButton) {
        const question = getQuestionById(aiButton.dataset.aiExplain, state);
        alert(
          `${buildTutorPrompt(question)}\n\nLocal tutor draft: Focus on the key clue, identify the tested mechanism, then eliminate each distractor using the explanation text. Production builds should call Claude API and cache the response per QID.`,
        );
        return;
      }

      if (event.target.closest("[data-cycle-translation]")) {
        const language = cycleTranslationLanguage(state);
        const selected = LANGUAGES.find((item) => item.code === language);
        persistAndRender();
        alert(`Translation language: ${selected ? selected.native : language}`);
        return;
      }

      const copyButton = event.target.closest("[data-copy-qids]");
      if (copyButton) {
        await navigator.clipboard.writeText(copyButton.dataset.copyQids);
        copyButton.textContent = "Copied";
        return;
      }

      if (event.target.closest("[data-retake-incorrect]")) {
        const attempt = state.attempts[0];
        const incorrect = attempt.score.results
          .filter((result) => !result.isCorrect)
          .map((result) => result.questionId);
        createStudySession(state, {
          count: "custom",
          customQuestionIds: incorrect.join(","),
          mode: "tutor",
        });
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-reset-state]")) {
        state = createDefaultState();
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-logout]")) {
        logoutAccount(state);
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-clear-admin]")) {
        getCustomContent(state).qbanks.forEach((bank) => {
          delete state.downloads[bank.id];
        });
        state.customContent = createDefaultState().customContent;
        queueSync(state, "admin_content", "DELETE", { cleared: true });
        persistAndRender();
        return;
      }

      if (event.target.closest("[data-export-admin]")) {
        const blob = new Blob([JSON.stringify(getCustomContent(state), null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "aneeq-admin-upload.json";
        link.click();
        URL.revokeObjectURL(url);
      }
    });

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPrompt = event;
      installButton.classList.remove("hidden");
    });

    installButton.addEventListener("click", async () => {
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt = undefined;
        installButton.classList.add("hidden");
      }
    });

    if (!isNativeShell() && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        syncStatus.textContent = "Service worker registration failed.";
      });
    }

    render();
  }

  function isNativeShell() {
    return Boolean(
      typeof window !== "undefined" &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === "function" &&
        window.Capacitor.isNativePlatform(),
    );
  }

  function showBootError(error) {
    const app = typeof document !== "undefined" && document.getElementById("app");
    if (!app) {
      return;
    }

    app.innerHTML = `
      <section class="card">
        <h2>App startup problem</h2>
        <p>The app could not start on this device WebView.</p>
        <pre>${escapeHtml(error && error.message ? error.message : String(error))}</pre>
      </section>
    `;
  }

  function formDataToObject(formData) {
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  const exported = {
    BOOKS,
    DEFAULT_SETTINGS,
    LANGUAGES,
    QBANKS,
    QUESTIONS,
    addHighlight,
    answerActiveQuestion,
    createAccount,
    createDefaultState,
    createStudySession,
    cycleTranslationLanguage,
    filterQuestions,
    finishSession,
    getQuestionStatus,
    getAllBooks,
    getAllQBanks,
    getAllQuestions,
    getCurrentUser,
    hashText,
    importAdminContent,
    isAdmin,
    isDueForReview,
    loginAccount,
    logoutAccount,
    normalizeAdminPayload,
    scoreSession,
    searchContent,
    translateText,
  };

  if (typeof module !== "undefined") {
    module.exports = exported;
  }

  if (typeof document !== "undefined") {
    try {
      initializeBrowserApp();
    } catch (error) {
      showBootError(error);
    }
  }

  const root = typeof globalThis !== "undefined" ? globalThis : window;
  root.AneeqMedical = exported;
})();

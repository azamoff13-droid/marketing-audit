// State management
const state = {
    currentStep: 0,
    answers: {
        isBusinessOwner: null,
        hasCRM: null,
        hasSalesDept: null,
        socialMediaStatus: null,
        industry: null,
        adPlatform: null,
        targetRevenue: null,
        avgCheck: null,
        conversionRate: null
    }
};

// Wizard Questions Data
const questions = [
    {
        id: 'isBusinessOwner',
        title: 'Siz biznes egasimisiz?',
        type: 'choice',
        options: [
            { label: 'Ha, o\'zim biznes egasiman', value: true },
            { label: 'Yo\'q, xodim yoki menejerman', value: false }
        ]
    },
    {
        id: 'hasCRM',
        title: 'Sizda CRM tizimi mavjudmi?',
        type: 'choice',
        options: [
            { label: '✅ Ha, mavjud', value: true },
            { label: '❌ Yo\'q, umuman yo\'q', value: false }
        ]
    },
    {
        id: 'hasSalesDept',
        title: 'Alohida sotuv bo\'limi (Menejerlar) bormi?',
        type: 'choice',
        options: [
            { label: '✅ Ha, menejerlar bor', value: true },
            { label: '❌ Yo\'q, o\'zim sotaman', value: false }
        ]
    },
    {
        id: 'socialMediaStatus',
        title: 'Ijtimoiy tarmoqlaringiz holati qanday? (Upakovka)',
        type: 'choice',
        options: [
            { label: '🔥 Zo\'r holatda', value: 'excellent' },
            { label: '👍 O\'rtacha', value: 'average' },
            { label: '👎 Yomon / Endi boshladik', value: 'poor' }
        ]
    },
    {
        id: 'industry',
        title: 'Biznesingiz qaysi sohada?',
        type: 'choice',
        options: [
            { label: '🛍️ Chakana savdo / E-commerce', value: 'retail' },
            { label: '💼 Xizmat ko\'rsatish / B2B', value: 'services' },
            { label: '📚 Info-biznes / Ta\'lim', value: 'infobiz' },
            { label: '🏥 Tibbiyot / Boshqa', value: 'other' }
        ]
    },
    {
        id: 'adPlatform',
        title: 'Asosiy reklama platformangiz?',
        type: 'choice',
        options: [
            { label: 'Instagram', value: 'Instagram' },
            { label: 'Facebook', value: 'Facebook' },
            { label: 'Google / YouTube', value: 'Google' },
            { label: 'Telegram / TikTok', value: 'Telegram' }
        ]
    },
    {
        id: 'targetRevenue',
        title: 'Oylik DAROMAD maqsadingiz? ($ da)',
        type: 'number',
        placeholder: 'Masalan: 10000',
        icon: '<i data-lucide="dollar-sign"></i>'
    },
    {
        id: 'avgCheck',
        title: 'O\'rtacha chek qancha? ($ da)',
        type: 'number',
        placeholder: 'Masalan: 60',
        icon: '<i data-lucide="tag"></i>'
    },
    {
        id: 'conversionRate',
        title: 'Sotuv konversiyasi necha foiz? (%)',
        type: 'number',
        placeholder: 'Masalan: 30',
        icon: '<i data-lucide="percent"></i>'
    }
];

// DOM Elements
const elements = {
    progressText: document.getElementById('progressText'),
    progressBar: document.getElementById('progressBar'),
    questionTitle: document.getElementById('questionTitle'),
    optionsContainer: document.getElementById('optionsContainer'),
    prevBtn: document.getElementById('prevBtn'),
    wizardSection: document.getElementById('wizardSection'),
    loadingSection: document.getElementById('loadingSection'),
    reportSection: document.getElementById('reportSection'),
    wizardFooter: document.querySelector('.wizard-footer')
};

// Initialize
function init() {
    lucide.createIcons();
    renderQuestion();
    
    elements.prevBtn.addEventListener('click', () => {
        if (state.currentStep > 0) {
            state.currentStep--;
            renderQuestion();
        }
    });

}

// Render the current question
function renderQuestion() {
    const q = questions[state.currentStep];
    
    // Update progress
    elements.progressText.textContent = `${state.currentStep + 1} / ${questions.length}`;
    const progressPercent = ((state.currentStep + 1) / questions.length) * 100;
    elements.progressBar.style.setProperty('--progress', `${progressPercent}%`);

    // Setup animation
    elements.questionTitle.classList.remove('fade-in');
    elements.optionsContainer.classList.remove('fade-in');
    void elements.questionTitle.offsetWidth; // trigger reflow
    elements.questionTitle.classList.add('fade-in');
    elements.optionsContainer.classList.add('fade-in');

    // Render Question Text
    elements.questionTitle.textContent = q.title;

    // Render Options/Inputs
    elements.optionsContainer.innerHTML = '';
    
    // Remove next btn if exists
    let existingNext = document.getElementById('nextBtn');
    if (existingNext) existingNext.remove();

    if (q.type === 'choice') {
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.label;
            
            // Re-select if already answered
            if (state.answers[q.id] === opt.value) {
                btn.classList.add('selected');
            }

            btn.onclick = () => handleChoice(q.id, opt.value, btn);
            elements.optionsContainer.appendChild(btn);
        });
    } else if (q.type === 'number') {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        wrapper.innerHTML = `
            <div class="input-icon">💲</div>
            <input type="number" class="input-field" id="${q.id}Input" placeholder="${q.placeholder}" value="${state.answers[q.id] || ''}">
        `;
        elements.optionsContainer.appendChild(wrapper);

        // Add "Keyingi" button for numeric inputs
        const nextBtn = document.createElement('button');
        nextBtn.id = 'nextBtn';
        nextBtn.className = 'btn btn-primary fade-in';
        nextBtn.innerHTML = 'Keyingi <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        
        nextBtn.onclick = () => {
            const val = document.getElementById(`${q.id}Input`).value;
            if (val && parseFloat(val) > 0) {
                state.answers[q.id] = parseFloat(val);
                nextStep();
            } else {
                alert("Iltimos, to\'g\'ri son kiriting!");
            }
        };
        
        elements.wizardFooter.appendChild(nextBtn);
        document.getElementById(`${q.id}Input`).focus();
        
        // Enter key support
        document.getElementById(`${q.id}Input`).addEventListener('keyup', (e) => {
            if (e.key === 'Enter') nextBtn.click();
        });
    }

    // Toggle Back button
    if (state.currentStep === 0) {
        elements.prevBtn.classList.add('fade-out');
    } else {
        elements.prevBtn.classList.remove('fade-out');
    }
}

function handleChoice(key, value, btnElement) {
    // Save answer
    state.answers[key] = value;
    
    // UI feedback
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');

    // Slight delay for effect
    setTimeout(() => {
        nextStep();
    }, 300);
}

function nextStep() {
    if (state.currentStep < questions.length - 1) {
        state.currentStep++;
        renderQuestion();
    } else {
        finishWizard();
    }
}

function finishWizard() {
    elements.wizardSection.classList.remove('active');
    elements.loadingSection.classList.remove('hidden');
    elements.loadingSection.classList.add('active');
    document.querySelector('.app-header').style.display = 'none';

    // Fake loading for dramatic effect
    setTimeout(() => {
        elements.loadingSection.classList.remove('active');
        elements.loadingSection.classList.add('hidden');
        generateReport();
    }, 2000);
}

// Calculations and Reporting
function generateReport() {
    elements.reportSection.classList.remove('hidden');
    elements.reportSection.classList.add('active', 'fade-in');

    const a = state.answers;

    // --- MATH ---
    const target = a.targetRevenue || 10000;
    const avgCheck = a.avgCheck || 60;
    const convRate = a.conversionRate || 30; // ex 30%

    // Required Clients
    const requiredClients = Math.ceil(target / avgCheck);
    
    // Required Leads
    const requiredLeads = Math.ceil(requiredClients / (convRate / 100));

    // Lead Price Baseline
    let baseCplMin = 0.8;
    let baseCplMax = 1.5;

    // Adjust CPL based on Ad Platform (mock heuristics)
    if (a.adPlatform === 'Google') { baseCplMin = 1.0; baseCplMax = 2.0; }
    if (a.adPlatform === 'Facebook') { baseCplMin = 0.9; baseCplMax = 1.6; }
    if (a.adPlatform === 'Telegram') { baseCplMin = 0.5; baseCplMax = 1.2; }

    const baseMinBudget = requiredLeads * baseCplMin;
    const baseMaxBudget = requiredLeads * baseCplMax;

    // Penalties calculation
    let penaltyPercent = 0;
    const warnings = [];
    const recs = [];

    if (!a.hasCRM) {
        penaltyPercent += 20;
        warnings.push("❌ CRM yo\'qligi sababli yo\'otishlar (+20%)");
        recs.push("CRM tizimi (AmoCRM/Bitrix24) o\'rnating, bu byudjetni 20% gacha tejaydi va mijozlar yo\'qolishining oldini oladi.");
    }
    
    if (!a.hasSalesDept) {
        penaltyPercent += 20;
        warnings.push("❌ Sotuvchilar yo\'qligi sababli lidlar kuyishi va past konversiya (+20%)");
        recs.push("Lidlar kuyib ketmasligi uchun alohida obmetka va sotuv menejeri yollang. O\'zingiz sotishingiz o\'sishga to\'sqinlik qiladi.");
    } else {
        recs.push("Sotuv bo\'limi borligi yaxshi! Sotuv menejerlarini KPI asosida baholash va skriptlarni yangilab turishni unutmang.");
    }

    if (a.socialMediaStatus === 'poor') {
        warnings.push("⚠️ Upakovka yomonligi konversiyani tushiradi va CPL (Lid narxi) ni qimmatlashtiradi.");
        recs.push("Ijtimoiy tarmoqlar vizualini (Upakovka) professionallarga topshiring. Bu sizning raqamli yuzingiz.");
    }

    recs.push("Reklamani kichik summa (Test byudjet) bilan boshlab, CPL ni aniq hisoblab oling va keyin masshtab qiling.");

    if (penaltyPercent === 0 && a.socialMediaStatus === 'excellent') {
        warnings.push("✅ Tizim juda yaxshi holatda. Hech qanday jiddiy yo\'qotish xavfi yo\'q!");
        document.getElementById('warningsCard').classList.remove('danger-glow');
        document.getElementById('warningsCard').classList.add('success-glow');
        document.getElementById('warningsList').classList.remove('danger');
    }

    // Apply Penalties to Budget!
    const multiplier = 1 + (penaltyPercent / 100);
    const finalMinBudget = Math.ceil(baseMinBudget * multiplier);
    const finalMaxBudget = Math.ceil(baseMaxBudget * multiplier);

    // --- DOM UPDATES ---
    document.getElementById('resTarget').textContent = `$${target.toLocaleString()}`;
    document.getElementById('resAvgCheck').textContent = `$${avgCheck}`;
    document.getElementById('resClients').textContent = requiredClients;
    
    document.getElementById('resConv').textContent = `${convRate}%`;
    document.getElementById('resLeads').textContent = requiredLeads;
    
    document.getElementById('resPlatform').textContent = `Platforma: ${a.adPlatform || 'Noma\'lum'}`;
    document.getElementById('resCpl').textContent = `$${baseCplMin.toFixed(2)} - ${baseCplMax.toFixed(2)} (Benchmark)`;
    document.getElementById('resMinBudget').textContent = `$${finalMinBudget.toLocaleString()}`;
    document.getElementById('resOptBudget').textContent = `$${finalMaxBudget.toLocaleString()}`;

    // Warnings list
    const warnUl = document.getElementById('warningsList');
    warnUl.innerHTML = '';
    warnings.forEach(w => {
        const li = document.createElement('li');
        li.textContent = w;
        warnUl.appendChild(li);
    });

    const penaltyAlert = document.getElementById('penaltyAlert');
    if (penaltyPercent > 0) {
        penaltyAlert.style.display = 'block';
        penaltyAlert.innerHTML = `Sizda tizim to\'liq bo\'lmagani uchun real byudjet <strong>${penaltyPercent}%</strong> ga qimmatroq tushishi mumkin.`;
    } else {
        penaltyAlert.style.display = 'none';
    }

    // Recommendations list
    const recOl = document.getElementById('recommendationsList');
    recOl.innerHTML = '';
    recs.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        recOl.appendChild(li);
    });
}

// Start
document.addEventListener('DOMContentLoaded', init);

/* =============================================
   CARDVALUE — RANKING ENGINE + UI
   ============================================= */

// ---- STATE ----
let allCards = [];
let pointsValuations = {};
let transferValuations = {};
let valuationMode = 'transfer'; // 'transfer' or 'cash'
let currentFilter = 'all';
let currentSort = 'net-value';
let currentSearch = '';
let compareList = []; // max 3 cards
let isPersonalized = false;

const DEFAULT_SPENDING = { dining: 500, groceries: 400, travel: 200, gas: 150, other: 750 };
let currentSpending = { ...DEFAULT_SPENDING };

// ---- ISSUER LOGOS ----
const ISSUER_LOGOS = {
  'Chase': 'https://www.google.com/s2/favicons?domain=chase.com&sz=128',
  'American Express': 'https://www.google.com/s2/favicons?domain=americanexpress.com&sz=128',
  'Citi': 'https://www.google.com/s2/favicons?domain=citi.com&sz=128',
  'Capital One': 'https://www.google.com/s2/favicons?domain=capitalone.com&sz=128',
  'Discover': 'https://www.google.com/s2/favicons?domain=discover.com&sz=128',
  'Bank of America': 'https://www.google.com/s2/favicons?domain=bankofamerica.com&sz=128',
  'Wells Fargo': 'https://www.google.com/s2/favicons?domain=wellsfargo.com&sz=128',
  'Wells Fargo (Bilt)': 'https://www.google.com/s2/favicons?domain=bfrb.io&sz=128',
  'US Bank': 'https://www.google.com/s2/favicons?domain=usbank.com&sz=128',
  'Goldman Sachs (Apple)': 'https://www.google.com/s2/favicons?domain=apple.com&sz=128',
  'Robinhood (Coastal Community Bank)': 'https://www.google.com/s2/favicons?domain=robinhood.com&sz=128',
  'Alliant Credit Union': 'https://www.google.com/s2/favicons?domain=alliantcreditunion.org&sz=128',
  'Citi (Costco)': 'https://www.google.com/s2/favicons?domain=costco.com&sz=128',
  'Elan Financial (Fidelity)': 'https://www.google.com/s2/favicons?domain=fidelity.com&sz=128',
  'SoFi (The Bank of Missouri)': 'https://www.google.com/s2/favicons?domain=sofi.com&sz=128',
  'Synchrony (Venmo)': 'https://www.google.com/s2/favicons?domain=venmo.com&sz=128',
  'PNC Bank': 'https://www.google.com/s2/favicons?domain=pnc.com&sz=128',
  'Chase (Amazon)': 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
};

const ISSUER_EMOJI = {
  'Chase': '🔵',
  'American Express': '🟦',
  'Citi': '🔷',
  'Capital One': '♦️',
  'Discover': '🟠',
  'Bank of America': '🏦',
  'Wells Fargo': '🔴',
  'US Bank': '🏛️',
  'Wells Fargo (Bilt)': '🏠',
  'Goldman Sachs (Apple)': '⬛',
  'Robinhood (Coastal Community Bank)': '🟢',
  'Alliant Credit Union': '🔵',
  'Citi (Costco)': '🟥',
  'Elan Financial (Fidelity)': '🟩',
  'SoFi (The Bank of Missouri)': '🟣',
  'Synchrony (Venmo)': '💙',
  'PNC Bank': '🟡',
  'Chase (Amazon)': '🟧',
};

// ---- CURRENCY LABELS ----
const CURRENCY_NAMES = {
  'chase_ur': 'UR pts',
  'amex_mr': 'MR pts',
  'capital_one_miles': 'Miles',
  'citi_ty': 'TY pts',
  'cashback': 'Cash back',
  'bilt_points': 'Bilt pts',
  'wells_fargo_pts': 'WF pts',
  'usbank_pts': 'USB pts',
  'bofa_pts': 'BofA pts',
  'alliant_cashback': 'Cash back',
  'robinhood_cashback': 'Cash back',
  'fidelity_cashback': 'Cash back',
  'sofi_cashback': 'Cash back',
  'venmo_cashback': 'Cash back',
  'pnc_cashback': 'Cash back',
  'amazon_cashback': 'Cash back',
  'discover_cashback': 'Cash back',
};

function getCurrencyLabel(currency) {
  const name = CURRENCY_NAMES[currency] || currency;
  if (name === 'Cash back') return 'Cash back';
  const pv = pointsValuations[currency] || 1;
  const unit = currency === 'capital_one_miles' ? '/mi' : '/pt';
  return `${name} · ${pv}¢${unit}`;
}

// ---- CATEGORY CONFIG ----
const CATEGORIES = [
  { key: 'dining',     label: 'Dining',     emoji: '🍽' },
  { key: 'groceries',  label: 'Groceries',  emoji: '🛒' },
  { key: 'travel',     label: 'Travel',     emoji: '✈️' },
  { key: 'gas',        label: 'Gas',        emoji: '⛽' },
  { key: 'other',      label: 'Everything Else', emoji: '🛍' },
];

// ---- ISSUER LOGO HELPER ----
function getIssuerLogoHTML(issuer, size = 28) {
  const logoUrl = ISSUER_LOGOS[issuer];
  if (logoUrl) {
    return `<img src="${logoUrl}" alt="${issuer}" width="${size}" height="${size}" style="border-radius:4px; object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;width:${size}px;height:${size}px;align-items:center;justify-content:center;font-size:${Math.round(size*0.6)}px">${ISSUER_EMOJI[issuer] || '💳'}</span>`;
  }
  return `<span style="font-size:${Math.round(size*0.6)}px">${ISSUER_EMOJI[issuer] || '💳'}</span>`;
}

// ---- CALCULATE ANNUAL VALUE ----
function calcAnnualValue(card, spending) {
  const pv = pointsValuations[card.currency] || 1;
  let total = 0;
  for (const cat of CATEGORIES) {
    const multiplier = card.rewards[cat.key] || 1;
    const monthlySpend = spending[cat.key] || 0;
    total += monthlySpend * multiplier * (pv / 100) * 12;
  }
  return Math.round(total);
}

function calcTotalCredits(card) {
  if (!card.credits || !Array.isArray(card.credits)) return 0;
  return card.credits.reduce((sum, c) => sum + c.value, 0);
}

function calcNetValue(card, spending) {
  const annualValue = calcAnnualValue(card, spending);
  const totalCredits = calcTotalCredits(card);
  const membershipCost = card.membershipRequired ? card.membershipRequired.cost : 0;
  return annualValue + totalCredits - card.annualFee - membershipCost;
}

function calcEffectiveRate(card, spending) {
  const annualValue = calcAnnualValue(card, spending);
  const totalSpend = Object.values(spending).reduce((a, b) => a + b, 0) * 12;
  if (totalSpend === 0) return 0;
  return ((annualValue / totalSpend) * 100).toFixed(2);
}

// ---- SORT CARDS ----
function sortCards(cards, sortBy, spending) {
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'net-value':
        return calcNetValue(b, spending) - calcNetValue(a, spending);
      case 'effective-rate':
        return parseFloat(calcEffectiveRate(b, spending)) - parseFloat(calcEffectiveRate(a, spending));
      case 'annual-value':
        return calcAnnualValue(b, spending) - calcAnnualValue(a, spending);
      case 'fee-low': {
        const feeA = a.annualFee + (a.membershipRequired ? a.membershipRequired.cost : 0);
        const feeB = b.annualFee + (b.membershipRequired ? b.membershipRequired.cost : 0);
        return feeA - feeB;
      }
      case 'fee-high': {
        const feeA2 = a.annualFee + (a.membershipRequired ? a.membershipRequired.cost : 0);
        const feeB2 = b.annualFee + (b.membershipRequired ? b.membershipRequired.cost : 0);
        return feeB2 - feeA2;
      }
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return calcNetValue(b, spending) - calcNetValue(a, spending);
    }
  });
}

// ---- FILTER CARDS ----
function filterCards(cards, filter) {
  if (filter === 'all') return cards;
  return cards.filter(c => c.tags.includes(filter));
}

// ---- SEARCH CARDS ----
function searchCards(cards, query) {
  if (!query) return cards;
  const q = query.toLowerCase();
  return cards.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.issuer.toLowerCase().includes(q) ||
    (c.bestFor && c.bestFor.toLowerCase().includes(q)) ||
    c.tags.some(t => t.toLowerCase().includes(q))
  );
}

// ---- COLUMN DEFINITIONS ----
const DATA_COLUMNS = [
  { key: 'effective-rate', thClass: 'th-rate',   label: 'Eff. Rate',  sortKeys: ['effective-rate'] },
  { key: 'annual-value',   thClass: 'th-earned', label: 'Earned/yr',  sortKeys: ['annual-value'] },
  { key: 'fee',            thClass: 'th-fee',    label: 'Fee',        sortKeys: ['fee-low', 'fee-high'] },
  { key: 'net-value',      thClass: 'th-net',    label: 'Net Value',  sortKeys: ['net-value'] },
];

function getOrderedColumns(sortBy) {
  const netCol = DATA_COLUMNS.find(c => c.key === 'net-value');
  const sortedCol = DATA_COLUMNS.find(c => c.sortKeys.includes(sortBy));

  // If sorting by net value or no match, put net value first then the rest
  if (!sortedCol || sortedCol.key === 'net-value') {
    return [netCol, ...DATA_COLUMNS.filter(c => c.key !== 'net-value')];
  }

  // Otherwise: sorted column first, net value second, then the rest
  const rest = DATA_COLUMNS.filter(c => c.key !== sortedCol.key && c.key !== 'net-value');
  return [sortedCol, netCol, ...rest];
}

function renderTableHead(sortBy) {
  const cols = getOrderedColumns(sortBy);
  const thead = document.getElementById('cardTableHead');
  thead.innerHTML = `<tr>
    <th class="th-rank">#</th>
    <th class="th-card">Card</th>
    ${cols.map(c => `<th class="${c.thClass}">${c.label}</th>`).join('')}
    <th class="th-apply">Apply</th>
    <th class="th-compare">Compare</th>
  </tr>`;
}

// ---- RENDER CARD LIST ----
function renderCards() {
  let results = filterCards(allCards, currentFilter);
  results = searchCards(results, currentSearch);
  const ranked = sortCards(results, currentSort, currentSpending);
  const list = document.getElementById('cardList');
  const count = document.getElementById('resultsCount');
  count.textContent = `${ranked.length} card${ranked.length !== 1 ? 's' : ''}`;

  renderTableHead(currentSort);
  const orderedCols = getOrderedColumns(currentSort);

  list.innerHTML = '';

  if (ranked.length === 0) {
    list.innerHTML = `<tr><td colspan="8" class="loading-state"><p>No cards match your search.</p></td></tr>`;
    return;
  }

  ranked.forEach((card, idx) => {
    const rank = idx + 1;
    const annualValue = calcAnnualValue(card, currentSpending);
    const netValue = calcNetValue(card, currentSpending);
    const effectiveRate = calcEffectiveRate(card, currentSpending);
    const isCompared = compareList.includes(card.id);

    const rankLabel = rank;

    const totalFee = card.annualFee + (card.membershipRequired ? card.membershipRequired.cost : 0);
    const feeDisplay = totalFee === 0 ? '<span class="no-fee">$0</span>' : `$${totalFee}`;

    const totalCredits = calcTotalCredits(card);
    const netClass = netValue >= 0 ? 'positive' : 'negative';
    const netDisplay = netValue >= 0 ? `+$${netValue.toLocaleString()}` : `-$${Math.abs(netValue).toLocaleString()}`;
    const creditsTag = totalCredits > 0 ? `<span class="credits-tag">incl. $${totalCredits.toLocaleString()} credits*</span>` : '';

    // Build cell HTML map
    const cellMap = {
      'effective-rate': `<td class="td-rate">
        <span class="rate-pct">${effectiveRate}%</span>
        <span class="rate-type">${getCurrencyLabel(card.currency)}</span>
      </td>`,
      'annual-value': `<td class="td-earned">$${annualValue.toLocaleString()}</td>`,
      'fee': `<td class="td-fee">${feeDisplay}</td>`,
      'net-value': `<td class="td-net ${netClass}">${netDisplay}${creditsTag}</td>`,
    };

    const el = document.createElement('tr');
    el.className = `card-row${isCompared ? ' selected' : ''}`;
    el.dataset.id = card.id;
    el.innerHTML = `
      <td class="td-rank"><span>${rankLabel}</span></td>
      <td class="td-card">
        <div class="card-identity">
          <span class="card-logo-inline">${getIssuerLogoHTML(card.issuer, 32)}</span>
          <div>
            <span class="card-name">${card.name}</span>
            <span class="card-issuer">${card.issuer}</span>
          </div>
        </div>
      </td>
      ${orderedCols.map(c => cellMap[c.key]).join('')}
      <td class="td-apply"><a href="${card.applyUrl}" target="_blank" rel="noopener" class="apply-link" onclick="event.stopPropagation()">Apply →</a></td>
      <td class="td-compare"><input type="checkbox" class="compare-check" title="Add to compare" ${isCompared ? 'checked' : ''} /></td>
    `;

    el.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        toggleCompare(card.id, e.target.checked);
        return;
      }
      openDetail(card);
    });

    el.querySelector('.compare-check').addEventListener('change', (e) => {
      toggleCompare(card.id, e.target.checked);
    });

    list.appendChild(el);
  });
}

// ---- DETAIL DRAWER ----
function openDetail(card) {
  const annualValue = calcAnnualValue(card, currentSpending);
  const totalCredits = calcTotalCredits(card);
  const netValue = calcNetValue(card, currentSpending);
  const effectiveRate = calcEffectiveRate(card, currentSpending);
  const totalFee = card.annualFee + (card.membershipRequired ? card.membershipRequired.cost : 0);
  const pv = pointsValuations[card.currency] || 1;
  const combinedValue = annualValue + totalCredits;

  document.getElementById('detailName').textContent = card.name;
  document.getElementById('detailIssuer').textContent = card.issuer;
  document.getElementById('detailLogo').innerHTML = getIssuerLogoHTML(card.issuer, 36);

  // Build body
  let html = '';

  // Value highlight
  html += `
    <div class="detail-section">
      <div class="value-highlight-box">
        <div class="big-number">$${combinedValue.toLocaleString()}</div>
        <div class="big-label">Estimated annual value${totalCredits > 0 ? ' (rewards + credits)' : ''}</div>
        <div class="big-sub">${totalCredits > 0 ? `$${annualValue.toLocaleString()} rewards + $${totalCredits.toLocaleString()} credits* · ` : `Based on ${isPersonalized ? 'your spending' : 'average American spending'} · `}${effectiveRate}% effective rate</div>
      </div>
    </div>
  `;

  // Membership note
  if (card.membershipRequired) {
    html += `
      <div class="membership-note">
        <strong>⚠️ Membership Required</strong>
        ${card.membershipRequired.description}
        ${card.membershipRequired.cost > 0 ? ` — $${card.membershipRequired.cost}/yr (already deducted from net value)` : ''}
      </div>
    `;
  }

  // Category breakdown
  html += `
    <div class="detail-section">
      <div class="detail-section-title">Reward Breakdown by Category</div>
      <table class="cat-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Rate</th>
            <th>Monthly Spend</th>
            <th>Annual Value</th>
          </tr>
        </thead>
        <tbody>
  `;
  let runningTotal = 0;
  for (const cat of CATEGORIES) {
    const multiplier = card.rewards[cat.key] || 1;
    const monthlySpend = currentSpending[cat.key] || 0;
    const catAnnual = Math.round(monthlySpend * multiplier * (pv / 100) * 12);
    runningTotal += catAnnual;
    const rawRate = multiplier > 1
      ? `${multiplier}x ${card.currency === 'cashback' ? 'cash' : 'pts'}`
      : `1x`;
    const cashRate = `(${(multiplier * pv).toFixed(1)}¢/$)`;
    html += `
      <tr>
        <td>${cat.label}</td>
        <td>${rawRate} <span class="cat-multiplier">${cashRate}</span></td>
        <td>$${monthlySpend.toLocaleString()}/mo</td>
        <td class="cat-value">$${catAnnual.toLocaleString()}</td>
      </tr>
    `;
  }
  if (card.note) {
    html += `
      <tr>
        <td colspan="4" style="font-size:12px;color:var(--text-muted);padding-top:8px;font-style:italic;">
          💡 ${card.note}
        </td>
      </tr>
    `;
  }
  html += `
        <tr class="total-row">
          <td colspan="3">Total Annual Value</td>
          <td>$${runningTotal.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
    </div>
  `;

  // Credits breakdown
  if (card.credits && card.credits.length > 0) {
    html += `
      <div class="detail-section">
        <div class="detail-section-title">Annual Credits & Statement Credits</div>
        <div class="credits-list">
    `;
    for (const credit of card.credits) {
      html += `
        <div class="credit-item">
          <div class="credit-header">
            <span class="credit-label">${credit.label}</span>
            <span class="credit-value">$${credit.value.toLocaleString()}/yr</span>
          </div>
          <div class="credit-desc">${credit.desc}</div>
        </div>
      `;
    }
    html += `
          <div class="credit-item credit-total">
            <div class="credit-header">
              <span class="credit-label">Total Annual Credits</span>
              <span class="credit-value">$${totalCredits.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>
        ${card.creditsCaveat ? `<div class="credits-caveat">⚠️ ${card.creditsCaveat}</div>` : ''}
        <p class="credits-disclaimer">* Assumes full utilization of all credits.</p>
      </div>
    `;
  }

  // Fee summary
  html += `
    <div class="detail-section">
      <div class="detail-section-title">Value vs. Cost</div>
      <div class="fee-summary">
        <div class="fee-box">
          <div class="fee-num green">$${annualValue.toLocaleString()}</div>
          <div class="fee-lbl">Rewards Earned</div>
        </div>
        ${totalCredits > 0 ? `
        <div class="fee-box">
          <div class="fee-num green">$${totalCredits.toLocaleString()}</div>
          <div class="fee-lbl">Annual Credits*</div>
        </div>
        ` : ''}
        <div class="fee-box">
          <div class="fee-num red">$${totalFee.toLocaleString()}</div>
          <div class="fee-lbl">Annual Fee</div>
        </div>
        <div class="fee-box">
          <div class="fee-num ${netValue >= 0 ? 'green' : 'red'}">
            ${netValue >= 0 ? '+' : ''}$${netValue.toLocaleString()}
          </div>
          <div class="fee-lbl">Net Annual Value</div>
        </div>
      </div>
    </div>
  `;

  // Signup bonus
  if (card.signupBonus) {
    const bonus = card.signupBonus;
    let bonusText = '';
    if (bonus.points && typeof bonus.points === 'number') {
      const bonusCash = Math.round(bonus.points * (pv / 100));
      bonusText = `<strong>${bonus.points.toLocaleString()} bonus points</strong> ≈ <strong>$${bonusCash.toLocaleString()} in value</strong>`;
      if (bonus.spendRequired) {
        bonusText += ` — spend $${bonus.spendRequired.toLocaleString()} in ${bonus.months} months`;
      }
    } else if (bonus.description) {
      bonusText = `<strong>${bonus.description}</strong>`;
    }
    html += `
      <div class="detail-section">
        <div class="detail-section-title">Sign-Up Bonus</div>
        <div class="bonus-box">🎁 ${bonusText}</div>
      </div>
    `;
  }

  // Perks
  if (card.perks && card.perks.length) {
    html += `
      <div class="detail-section">
        <div class="detail-section-title">Key Perks & Benefits</div>
        <ul class="perks-list">
          ${card.perks.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Apply button
  html += `
    <div class="detail-section">
      <a href="${card.applyUrl}" target="_blank" rel="noopener" class="btn-apply-card">
        Apply for the ${card.name} →
      </a>
    </div>
  `;

  document.getElementById('detailBody').innerHTML = html;
  document.getElementById('detailDrawer').classList.add('open');
  document.getElementById('detailOverlay').classList.add('open');
}

function closeDetail() {
  document.getElementById('detailDrawer').classList.remove('open');
  document.getElementById('detailOverlay').classList.remove('open');
}

// ---- COMPARE ----
function toggleCompare(cardId, checked) {
  if (checked) {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 cards at a time. Remove one first.');
      renderCards();
      return;
    }
    if (!compareList.includes(cardId)) compareList.push(cardId);
  } else {
    compareList = compareList.filter(id => id !== cardId);
  }
  renderCompareBar();
  renderCards();
}

function renderCompareBar() {
  const bar = document.getElementById('compareBar');
  const slots = document.getElementById('compareSlots');
  if (compareList.length === 0) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');
  slots.innerHTML = compareList.map(id => {
    const card = allCards.find(c => c.id === id);
    return `<div class="compare-slot"><strong>${card.name}</strong>${card.issuer}</div>`;
  }).join('');
}

function openCompareModal() {
  if (compareList.length < 2) {
    alert('Select at least 2 cards to compare.');
    return;
  }
  const cards = compareList.map(id => allCards.find(c => c.id === id));

  const rows = [
    { label: 'Annual Fee', fn: (c) => `$${(c.annualFee + (c.membershipRequired ? c.membershipRequired.cost : 0)).toLocaleString()}` },
    { label: 'Rewards Earned', fn: (c) => `$${calcAnnualValue(c, currentSpending).toLocaleString()}`, compare: true, better: 'max' },
    { label: 'Annual Credits*', fn: (c) => { const tc = calcTotalCredits(c); return tc > 0 ? `$${tc.toLocaleString()}` : '—'; }, compare: true, better: 'max' },
    { label: 'Net Annual Value', fn: (c) => `$${calcNetValue(c, currentSpending).toLocaleString()}`, compare: true, better: 'max' },
    { label: 'Effective Rate', fn: (c) => `${calcEffectiveRate(c, currentSpending)}%`, compare: true, better: 'max' },
    ...CATEGORIES.map(cat => ({
      label: `${cat.label}`,
      fn: (c) => {
        const m = c.rewards[cat.key] || 1;
        const pv = pointsValuations[c.currency] || 1;
        return `${m}x = ${(m * pv).toFixed(1)}¢/$`;
      },
      compare: true,
      better: 'max',
      valueKey: (c) => (c.rewards[cat.key] || 1) * (pointsValuations[c.currency] || 1),
    })),
    { label: 'Best For', fn: (c) => c.bestFor || '—' },
  ];

  let html = `<table class="compare-table"><thead><tr><th>Feature</th>`;
  for (const c of cards) html += `<th>${c.name}</th>`;
  html += `</tr></thead><tbody>`;

  for (const row of rows) {
    html += `<tr><td>${row.label}</td>`;
    const values = cards.map(c => row.valueKey ? row.valueKey(c) : parseFloat(String(row.fn(c)).replace(/[^0-9.-]/g, '')));
    const best = row.better === 'max' ? Math.max(...values) : Math.min(...values);
    for (let i = 0; i < cards.length; i++) {
      const display = row.fn(cards[i]);
      const isWinner = row.compare && values[i] === best;
      html += `<td class="${isWinner ? 'compare-winner' : ''}">${display}${isWinner && row.compare ? ' ✓' : ''}</td>`;
    }
    html += `</tr>`;
  }

  html += `</tbody></table>`;
  document.getElementById('compareTableWrap').innerHTML = html;
  document.getElementById('compareOverlay').classList.add('open');
}

// ---- PERSONALIZE ----
function getSpendingFromInputs() {
  return {
    dining:     parseFloat(document.getElementById('sp_dining').value) || 0,
    groceries:  parseFloat(document.getElementById('sp_groceries').value) || 0,
    travel:     parseFloat(document.getElementById('sp_travel').value) || 0,
    gas:        parseFloat(document.getElementById('sp_gas').value) || 0,
    other:      parseFloat(document.getElementById('sp_other').value) || 0,
  };
}

function applyPersonalization() {
  currentSpending = getSpendingFromInputs();
  isPersonalized = true;
  closePersonalizeDrawer();
  document.querySelector('.default-profile-label').innerHTML = `
    <span class="profile-dot" style="background:var(--purple)"></span>
    Ranked by your spending
  `;
  renderCards();
}

function resetPersonalization() {
  currentSpending = { ...DEFAULT_SPENDING };
  isPersonalized = false;
  document.getElementById('sp_dining').value = DEFAULT_SPENDING.dining;
  document.getElementById('sp_groceries').value = DEFAULT_SPENDING.groceries;
  document.getElementById('sp_travel').value = DEFAULT_SPENDING.travel;
  document.getElementById('sp_gas').value = DEFAULT_SPENDING.gas;
  document.getElementById('sp_other').value = DEFAULT_SPENDING.other;
  document.querySelector('.default-profile-label').innerHTML = `
    <span class="profile-dot default"></span>
    Ranked by average American spending
  `;
  renderCards();
}

function openPersonalizeDrawer() {
  document.getElementById('personalizeDrawer').classList.add('open');
}

function closePersonalizeDrawer() {
  document.getElementById('personalizeDrawer').classList.remove('open');
}

// ---- EVENT LISTENERS ----
function bindEvents() {
  // Personalize
  document.getElementById('btnPersonalize').addEventListener('click', () => {
    const drawer = document.getElementById('personalizeDrawer');
    if (drawer.classList.contains('open')) {
      closePersonalizeDrawer();
    } else {
      openPersonalizeDrawer();
    }
  });
  document.getElementById('drawerClose').addEventListener('click', closePersonalizeDrawer);
  document.getElementById('btnApply').addEventListener('click', applyPersonalization);
  document.getElementById('btnReset').addEventListener('click', resetPersonalization);

  // Inputs: live re-rank on Enter
  document.querySelectorAll('.spending-inputs input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyPersonalization();
    });
  });

  // Search
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearch = e.target.value.trim();
      renderCards();
    }, 200);
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCards();
  });

  // Valuation toggle
  document.querySelectorAll('.val-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === valuationMode) return;
      valuationMode = mode;
      document.querySelectorAll('.val-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (mode === 'cash') {
        // Set all valuations to 1.0 (cash redemption)
        for (const key of Object.keys(pointsValuations)) {
          pointsValuations[key] = 1.0;
        }
      } else {
        // Restore transfer partner valuations
        Object.assign(pointsValuations, transferValuations);
      }
      renderCards();
    });
  });

  // Valuation help popover
  document.getElementById('valHelpBtn').addEventListener('click', () => {
    document.getElementById('valHelpPopover').classList.add('open');
  });
  document.getElementById('valHelpClose').addEventListener('click', () => {
    document.getElementById('valHelpPopover').classList.remove('open');
  });
  document.getElementById('valHelpPopover').addEventListener('click', (e) => {
    if (e.target === document.getElementById('valHelpPopover')) {
      document.getElementById('valHelpPopover').classList.remove('open');
    }
  });

  // Filters
  document.getElementById('filterChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    renderCards();
  });

  // Detail close
  document.getElementById('detailClose').addEventListener('click', closeDetail);
  document.getElementById('detailOverlay').addEventListener('click', closeDetail);

  // Compare bar
  document.getElementById('btnCompareView').addEventListener('click', openCompareModal);
  document.getElementById('btnCompareClear').addEventListener('click', () => {
    compareList = [];
    renderCompareBar();
    renderCards();
  });

  // Compare modal close
  document.getElementById('compareModalClose').addEventListener('click', () => {
    document.getElementById('compareOverlay').classList.remove('open');
  });
  document.getElementById('compareOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('compareOverlay')) {
      document.getElementById('compareOverlay').classList.remove('open');
    }
  });

  // Keyboard: Escape closes drawers/modals, / focuses search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetail();
      closePersonalizeDrawer();
      document.getElementById('compareOverlay').classList.remove('open');
      document.getElementById('valHelpPopover').classList.remove('open');
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
}

// ---- INIT ----
async function init() {
  try {
    const res = await fetch('data/cards.json?v=' + Date.now());
    const data = await res.json();
    allCards = data.cards;
    pointsValuations = data.pointsValuations;
    transferValuations = { ...data.pointsValuations };
    bindEvents();
    renderCards();
  } catch (err) {
    document.getElementById('cardList').innerHTML = `
      <div class="loading-state">
        <p>⚠️ Error loading card data. Make sure you're running this from a local server or just opening the file directly.</p>
      </div>
    `;
    console.error('Failed to load cards.json:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);

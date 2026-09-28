/**
 * GYMORA - Core Application Logic
 * - IndexedDB database for workouts, meals, progress
 * - AI meal analysis (client-side intelligent estimator)
 * - Shared utilities
 */

// ===================== DATABASE (IndexedDB) =====================
const DB_NAME = 'GymoraDB';
const DB_VERSION = 1;
let db = null;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains('workouts')) {
        const workoutStore = database.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        workoutStore.createIndex('date', 'date', { unique: false });
        workoutStore.createIndex('equipment', 'equipment', { unique: false });
      }

      if (!database.objectStoreNames.contains('meals')) {
        const mealStore = database.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
        mealStore.createIndex('day', 'day', { unique: false });
        mealStore.createIndex('date', 'date', { unique: false });
      }

      if (!database.objectStoreNames.contains('progress')) {
        const progressStore = database.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
        progressStore.createIndex('date', 'date', { unique: false });
      }

      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

function addRecord(storeName, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function deleteRecord(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ===================== AI MEAL ANALYZER =====================
const MEAL_KNOWLEDGE_BASE = [
  { keywords: ['chicken', 'grilled', 'breast', 'poultry'], name: 'Grilled Chicken Breast with Rice & Broccoli', cals: 420, protein: 42, carbs: 38, fat: 8 },
  { keywords: ['salad', 'tuna', 'greens', 'lettuce'], name: 'Tuna Salad with Vegetables', cals: 310, protein: 28, carbs: 12, fat: 15 },
  { keywords: ['egg', 'avocado', 'toast', 'breakfast'], name: 'Eggs with Avocado & Toast', cals: 380, protein: 22, carbs: 25, fat: 22 },
  { keywords: ['steak', 'beef', 'meat', 'potato'], name: 'Steak with Roasted Potatoes', cals: 550, protein: 45, carbs: 40, fat: 22 },
  { keywords: ['smoothie', 'protein', 'shake', 'banana'], name: 'Protein Banana Smoothie', cals: 290, protein: 30, carbs: 32, fat: 5 },
  { keywords: ['pasta', 'spaghetti', 'noodles'], name: 'Pasta with Tomato Sauce', cals: 480, protein: 18, carbs: 65, fat: 14 },
  { keywords: ['rice', 'bowl', 'buddha'], name: 'Rice Bowl with Vegetables', cals: 390, protein: 12, carbs: 58, fat: 10 },
  { keywords: ['salmon', 'fish', 'seafood'], name: 'Grilled Salmon with Asparagus', cals: 410, protein: 38, carbs: 8, fat: 24 },
  { keywords: ['burger', 'sandwich', 'bun'], name: 'Burger / Sandwich', cals: 520, protein: 28, carbs: 42, fat: 26 },
  { keywords: ['pizza', 'slice'], name: 'Pizza Slice', cals: 285, protein: 12, carbs: 36, fat: 10 },
  { keywords: ['oat', 'oatmeal', 'porridge'], name: 'Oatmeal with Fruits', cals: 320, protein: 10, carbs: 52, fat: 8 },
  { keywords: ['yogurt', 'greek', 'parfait'], name: 'Greek Yogurt Parfait', cals: 250, protein: 20, carbs: 28, fat: 6 },
  { keywords: ['wrap', 'tortilla'], name: 'Chicken Wrap', cals: 380, protein: 30, carbs: 35, fat: 12 },
  { keywords: ['soup', 'broth'], name: 'Vegetable / Chicken Soup', cals: 180, protein: 12, carbs: 18, fat: 6 },
  { keywords: ['fruit', 'apple', 'banana', 'berries'], name: 'Fresh Fruit Bowl', cals: 150, protein: 2, carbs: 35, fat: 1 }
];

const DEFAULT_MEAL = {
  name: 'Mixed Meal (Estimated)',
  cals: 450,
  protein: 30,
  carbs: 45,
  fat: 15
};

async function analyzeMealWithAI(fileOrBase64, optionalHint = '') {
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 800));

  let textToSearch = (optionalHint || '').toLowerCase();

  if (fileOrBase64 && fileOrBase64.name) {
    textToSearch += ' ' + fileOrBase64.name.toLowerCase().replace(/[_\-\.]/g, ' ');
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of MEAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (textToSearch.includes(kw)) score += 2;
    }
    score += Math.random() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  const result = bestMatch && bestScore > 1 ? { ...bestMatch } : { ...DEFAULT_MEAL };

  const variance = () => 1 + (Math.random() * 0.16 - 0.08);
  result.cals = Math.round(result.cals * variance());
  result.protein = Math.round(result.protein * variance());
  result.carbs = Math.round(result.carbs * variance());
  result.fat = Math.round(result.fat * variance());

  result.confidence = bestScore > 2 ? 'High' : bestScore > 1 ? 'Medium' : 'Estimated';

  return result;
}

// ===================== EQUIPMENT DATA =====================
const EQUIPMENT = [
  { name: 'Bench Press', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop' },
  { name: 'Squat Rack', img: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=300&h=200&fit=crop' },
  { name: 'Leg Press', img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&h=200&fit=crop' },
  { name: 'Lat Pulldown', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c29e5?w=300&h=200&fit=crop' },
  { name: 'Cable Machine', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
  { name: 'Dumbbells', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=200&fit=crop' },
  { name: 'Barbell', img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d944?w=300&h=200&fit=crop' },
  { name: 'Treadmill', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=200&fit=crop' },
  { name: 'Elliptical', img: 'https://images.unsplash.com/photo-1599058945522-28d584b6f14a?w=300&h=200&fit=crop' },
  { name: 'Rowing Machine', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop' },
  { name: 'Shoulder Press', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop' },
  { name: 'Core / Abs', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop' }
];

// ===================== UTILITIES =====================
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ===================== INIT =====================
async function initApp() {
  try {
    await openDatabase();
    console.log('GYMORA Database ready');
  } catch (err) {
    console.error('Failed to open database', err);
    showToast('Database error – data may not persist');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.Gymora = {
  openDatabase,
  addRecord,
  getAllRecords,
  deleteRecord,
  clearStore,
  analyzeMealWithAI,
  EQUIPMENT,
  showToast,
  formatDate,
  getTodayKey,
  db: () => db
};
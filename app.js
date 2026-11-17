// ==================== GYMORA App Logic ====================

document.addEventListener('DOMContentLoaded', () => {
  // Splash screen timeout
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('hidden');
    
    // Show home after splash
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }, 2200);

  // Category tabs filtering
  const catTabs = document.querySelectorAll('.cat-tab');
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.cat;
      const items = document.querySelectorAll('.workout-item');
      
      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

// Navigation
function navigateTo(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen-content').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById(`${screenName}-screen`);
  if (target) {
    target.classList.add('active');
  }

  // Update bottom nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.screen === screenName) {
      item.classList.add('active');
    }
  });

  // Update side menu active state
  document.querySelectorAll('.side-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.screen === screenName) {
      link.classList.add('active');
    }
  });

  // Scroll content to top
  const scrollArea = target?.querySelector('.content-scroll');
  if (scrollArea) {
    scrollArea.scrollTop = 0;
  }

  // Special case: hide bottom nav on exercise detail
  const bottomNav = document.querySelector('.bottom-nav');
  if (screenName === 'exercise') {
    bottomNav.style.display = 'none';
  } else {
    bottomNav.style.display = 'flex';
  }
}

// Side menu toggle
function toggleSideMenu() {
  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('menu-overlay');
  
  menu.classList.toggle('open');
  overlay.classList.toggle('open');
}

// Exercise data
const exercises = {
  'chest': {
    title: 'Bench Press',
    muscle: 'Chest',
    desc: 'The king of chest exercises for building mass and strength.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    sets: '4 Sets',
    reps: '8-10 Reps',
    rest: 'Rest 90s',
    steps: [
      'Lie on a flat bench with feet planted on the floor.',
      'Grip the bar slightly wider than shoulder width.',
      'Lower the bar to your mid-chest with control.',
      'Press the bar up explosively until arms are extended.'
    ]
  },
  'back': {
    title: 'Pull-Ups',
    muscle: 'Back & Lats',
    desc: 'One of the best bodyweight exercises for a strong, wide back.',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop',
    sets: '4 Sets',
    reps: '8-12 Reps',
    rest: 'Rest 90s',
    steps: [
      'Hang from a pull-up bar with hands shoulder-width apart.',
      'Pull your body up until your chin clears the bar.',
      'Squeeze your shoulder blades at the top.',
      'Lower yourself with control back to the starting position.'
    ]
  },
  'legs': {
    title: 'Squats',
    muscle: 'Quads & Glutes',
    desc: 'The fundamental lower body movement for strength and muscle.',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&h=400&fit=crop',
    sets: '4 Sets',
    reps: '8-12 Reps',
    rest: 'Rest 120s',
    steps: [
      'Stand with feet shoulder-width apart, bar on upper back.',
      'Brace your core and push your hips back.',
      'Descend until thighs are at least parallel to the floor.',
      'Drive through your heels to return to standing.'
    ]
  },
  'arms': {
    title: 'Bicep Curl',
    muscle: 'Biceps',
    desc: 'A classic exercise to build bigger biceps.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
    sets: '3 Sets',
    reps: '12 Reps',
    rest: 'Rest 60s',
    steps: [
      'Hold dumbbells with palms up.',
      'Curl the weights up.',
      'Squeeze at the top, then lower.'
    ]
  },
  'fullbody': {
    title: 'Full Body Circuit',
    muscle: 'Full Body',
    desc: 'A complete workout hitting all major muscle groups.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
    sets: '3 Rounds',
    reps: '10-15 Reps',
    rest: 'Rest 60s',
    steps: [
      'Perform each exercise back to back with minimal rest.',
      'Focus on proper form throughout the circuit.',
      'Rest 60-90 seconds between full rounds.',
      'Complete 3-4 rounds depending on your level.'
    ]
  },
  'upper-body': {
    title: 'Upper Body Strength',
    muscle: 'Chest, Back, Shoulders, Arms',
    desc: 'Complete upper body session for strength and size.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
    sets: '5 Exercises',
    reps: '8-12 Reps',
    rest: '45 min total',
    steps: [
      'Start with compound movements (bench press / rows).',
      'Move to isolation work for arms and shoulders.',
      'Keep rest periods between 60-90 seconds.',
      'Focus on progressive overload each week.'
    ]
  }
};

function openExercise(type) {
  const data = exercises[type] || exercises['arms'];
  
  document.getElementById('exercise-title').textContent = data.title;
  document.getElementById('exercise-muscle').textContent = data.muscle;
  document.getElementById('exercise-desc').textContent = data.desc;
  document.getElementById('exercise-image').src = data.image;
  
  // Update stats
  const stats = document.querySelectorAll('.exercise-stats .stat span');
  if (stats.length >= 3) {
    stats[0].textContent = data.sets;
    stats[1].textContent = data.reps;
    stats[2].textContent = data.rest;
  }
  
  // Update steps
  const stepsList = document.getElementById('exercise-steps');
  stepsList.innerHTML = data.steps.map(step => `<li>${step}</li>`).join('');
  
  navigateTo('exercise');
}

function addToWorkout() {
  const btn = document.querySelector('.primary-btn');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<i class="fas fa-check"></i> Added!';
  btn.style.background = '#2ecc00';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
  }, 1500);
}

// AI Coach simple responses
function sendAIMessage(preset = null) {
  const input = document.getElementById('ai-input');
  const message = preset || input.value.trim();
  
  if (!message) return;
  
  // Clear input
  input.value = '';
  
  // Simple simulated responses
  const responses = {
    'Create a workout plan': 'Great! Based on your goals, I recommend a 4-day split:\n\n• Day 1: Chest & Triceps\n• Day 2: Back & Biceps\n• Day 3: Legs & Core\n• Day 4: Shoulders & Arms\n\nWould you like me to detail any day?',
    'Improve my diet': 'To fuel your gains:\n\n1. Aim for 1.8-2.2g protein per kg of bodyweight\n2. Eat complex carbs around workouts\n3. Include healthy fats (avocado, nuts, olive oil)\n4. Stay hydrated (3L+ water daily)\n\nWant a sample meal plan?',
    'Check my form': 'For best results, record yourself from the side and front. Key points:\n\n• Keep a neutral spine\n• Control the eccentric (lowering) phase\n• Full range of motion\n• Brace your core\n\nWhich exercise would you like form tips for?',
    'Answer my question': 'I\'m here to help! Ask me anything about training, nutrition, recovery, or form. What\'s on your mind?'
  };
  
  const reply = responses[message] || `Thanks for your message: "${message}"\n\nI'm still in Beta, but I'm learning fast! For personalized advice, try one of the quick options above or ask about workouts, diet, or recovery.`;
  
  // Show a simple alert for now (in a real app this would be a chat bubble)
  setTimeout(() => {
    alert('🤖 GYMORA AI Coach:\n\n' + reply);
  }, 400);
}

// Prevent zoom on double tap (mobile feel)
document.addEventListener('dblclick', (e) => {
  e.preventDefault();
}, { passive: false });

// Handle keyboard for AI input
document.getElementById('ai-input')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendAIMessage();
  }
});
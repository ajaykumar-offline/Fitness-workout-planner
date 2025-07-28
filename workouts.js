// Sample exercise data
const exercises = {
    strength: [
        { name: 'Bench Press', sets: 3, reps: 10, duration: '5 min', calories: 50, category: 'Chest' },
        { name: 'Squats', sets: 4, reps: 12, duration: '8 min', calories: 80, category: 'Legs' },
        { name: 'Deadlift', sets: 3, reps: 8, duration: '7 min', calories: 70, category: 'Back' },
        { name: 'Shoulder Press', sets: 3, reps: 10, duration: '5 min', calories: 45, category: 'Shoulders' }
    ],
    cardio: [
        { name: 'Running', duration: '30 min', intensity: 'High', calories: 300 },
        { name: 'Cycling', duration: '45 min', intensity: 'Medium', calories: 250 },
        { name: 'Jump Rope', duration: '15 min', intensity: 'High', calories: 150 },
        { name: 'Swimming', duration: '30 min', intensity: 'Medium', calories: 280 }
    ],
    yoga: [
        { name: 'Sun Salutation', duration: '10 min', level: 'Beginner', calories: 40 },
        { name: 'Warrior Pose', duration: '5 min', level: 'Intermediate', calories: 25 },
        { name: 'Tree Pose', duration: '5 min', level: 'Beginner', calories: 20 },
        { name: 'Downward Dog', duration: '5 min', level: 'Beginner', calories: 25 }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add exercise buttons
    document.querySelectorAll('.add-exercise').forEach(button => {
        button.addEventListener('click', (e) => {
            const exercise = JSON.parse(e.target.dataset.exercise);
            window.location.href = `planner.html?exercise=${encodeURIComponent(JSON.stringify(exercise))}`;
        });
    });
} 
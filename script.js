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

// Profile Management
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
const MAX_PROFILES = 5;

// Initialize profiles
function initializeProfiles() {
    const profileList = document.getElementById('profile-list');
    profileList.innerHTML = '';
    
    profiles.forEach((profile, index) => {
        const profileElement = createProfileElement(profile, index);
        profileList.appendChild(profileElement);
    });
}

// Create profile element
function createProfileElement(profile, index) {
    const div = document.createElement('div');
    div.className = 'profile-item mb-3 p-3 border rounded';
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-1">${profile.name}</h5>
                <div class="small text-muted">
                    Age: ${profile.age} | Weight: ${profile.weight}kg | Height: ${profile.height}cm
                </div>
                <div class="small text-muted">Goal: ${profile.goal}</div>
            </div>
            <button class="btn btn-sm btn-danger delete-profile" data-index="${index}">Delete</button>
        </div>
    `;
    return div;
}

// Save profile
function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const age = document.getElementById('profile-age').value;
    const weight = document.getElementById('profile-weight').value;
    const height = document.getElementById('profile-height').value;
    const goal = document.getElementById('profile-goal').value;

    if (profiles.length >= MAX_PROFILES) {
        alert('Maximum number of profiles reached (5)');
        return;
    }

    const profile = { name, age, weight, height, goal };
    profiles.push(profile);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    
    initializeProfiles();
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    document.getElementById('profile-form').reset();
}

// Delete profile
function deleteProfile(index) {
    profiles.splice(index, 1);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    initializeProfiles();
}

// Setup profile event listeners
function setupProfileEventListeners() {
    document.getElementById('save-profile').addEventListener('click', saveProfile);
    
    document.getElementById('profile-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-profile')) {
            const index = e.target.dataset.index;
            if (confirm('Are you sure you want to delete this profile?')) {
                deleteProfile(index);
            }
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeWorkoutSchedule();
    populateExerciseList();
    setupEventListeners();
    initializeProfiles();
    setupProfileEventListeners();
});

// Initialize the workout schedule
function initializeWorkoutSchedule() {
    const schedule = document.getElementById('workout-schedule');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-schedule mb-3';
        dayElement.innerHTML = `
            <h6>${day}</h6>
            <div class="exercises" data-day="${day.toLowerCase()}"></div>
            <div class="workout-summary" data-day="${day.toLowerCase()}">
                <small class="text-muted">Total Time: 0 min | Calories: 0</small>
            </div>
        `;
        schedule.appendChild(dayElement);
    });
}

// Populate the exercise list
function populateExerciseList() {
    const exerciseList = document.getElementById('exercise-list');
    Object.keys(exercises).forEach(category => {
        const categoryHeader = document.createElement('h6');
        categoryHeader.className = 'mt-3 mb-2';
        categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        exerciseList.appendChild(categoryHeader);

        exercises[category].forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">${exercise.name}</span>
                        <div class="small text-muted">
                            ${exercise.sets ? `Sets: ${exercise.sets} | Reps: ${exercise.reps} | ` : ''}
                            Duration: ${exercise.duration} | Calories: ${exercise.calories}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary add-exercise" 
                            data-exercise='${JSON.stringify(exercise)}'>
                        Add
                    </button>
                </div>
            `;
            exerciseList.appendChild(exerciseItem);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add workout button
    document.getElementById('add-workout').addEventListener('click', () => {
        const day = prompt('Enter the day of the week:');
        if (day) {
            const exercise = prompt('Enter the exercise name:');
            if (exercise) {
                addExerciseToSchedule(day.toLowerCase(), exercise);
            }
        }
    });

    // Add exercise buttons
    document.querySelectorAll('.add-exercise').forEach(button => {
        button.addEventListener('click', (e) => {
            const exercise = JSON.parse(e.target.dataset.exercise);
            const day = prompt('Enter the day of the week:');
            if (day) {
                addExerciseToSchedule(day.toLowerCase(), exercise);
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.input-group input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterExercises(searchTerm);
    });
}

// Add exercise to schedule
function addExerciseToSchedule(day, exercise) {
    const dayExercises = document.querySelector(`.exercises[data-day="${day}"]`);
    if (dayExercises) {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise-item';
        exerciseElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-bold">${typeof exercise === 'string' ? exercise : exercise.name}</span>
                    <div class="small text-muted">
                        ${exercise.sets ? `Sets: ${exercise.sets} | Reps: ${exercise.reps} | ` : ''}
                        Duration: ${exercise.duration} | Calories: ${exercise.calories}
                    </div>
                </div>
                <button class="btn btn-sm btn-danger remove-exercise">Remove</button>
            </div>
        `;
        dayExercises.appendChild(exerciseElement);

        // Add remove functionality
        exerciseElement.querySelector('.remove-exercise').addEventListener('click', () => {
            exerciseElement.remove();
            updateWorkoutSummary(day);
        });

        // Update workout summary
        updateWorkoutSummary(day);
    }
}

// Update workout summary
function updateWorkoutSummary(day) {
    const dayExercises = document.querySelector(`.exercises[data-day="${day}"]`);
    const summaryElement = document.querySelector(`.workout-summary[data-day="${day}"]`);
    
    if (dayExercises && summaryElement) {
        const exercises = dayExercises.querySelectorAll('.exercise-item');
        let totalTime = 0;
        let totalCalories = 0;

        exercises.forEach(exercise => {
            const durationText = exercise.querySelector('.text-muted').textContent;
            const durationMatch = durationText.match(/Duration: (\d+) min/);
            const caloriesMatch = durationText.match(/Calories: (\d+)/);

            if (durationMatch) {
                totalTime += parseInt(durationMatch[1]);
            }
            if (caloriesMatch) {
                totalCalories += parseInt(caloriesMatch[1]);
            }
        });

        summaryElement.innerHTML = `
            <small class="text-muted">Total Time: ${totalTime} min | Calories: ${totalCalories}</small>
        `;
    }
}

// Filter exercises based on search term
function filterExercises(searchTerm) {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('.fw-bold').textContent.toLowerCase();
        if (exerciseName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 
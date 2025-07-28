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
    ],
    zumba: [
        { 
            name: 'Zumba Basic Steps', 
            duration: '45 min', 
            level: 'Beginner', 
            calories: 350,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            description: 'Learn fundamental Zumba moves and basic choreography'
        },
        { 
            name: 'Zumba Latin Rhythms', 
            duration: '60 min', 
            level: 'Intermediate', 
            calories: 500,
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            description: 'Dance to Latin music with salsa, merengue, and reggaeton moves'
        },
        { 
            name: 'Zumba Toning', 
            duration: '45 min', 
            level: 'Intermediate', 
            calories: 400,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            description: 'Combine dance with light weights for muscle toning'
        },
        { 
            name: 'Zumba Gold', 
            duration: '30 min', 
            level: 'Beginner', 
            calories: 250,
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            description: 'Modified Zumba moves perfect for beginners and seniors'
        }
    ]
};

// Get selected profile
const selectedProfile = JSON.parse(localStorage.getItem('selectedProfile'));

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    if (!selectedProfile) {
        showProfileAlert();
    } else {
        initializeWorkoutSchedule();
        populateExerciseList();
        setupEventListeners();
    }
});

// Show profile alert
function showProfileAlert() {
    const container = document.querySelector('.container');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show';
    alertDiv.innerHTML = `
        Please select a profile first to create your workout plan.
        <a href="profile.html" class="alert-link">Go to Profile</a>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(alertDiv, container.firstChild);
}

// Initialize the workout schedule
function initializeWorkoutSchedule() {
    const schedule = document.getElementById('workout-schedule');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Load saved workout plan for the selected profile
    const savedPlan = JSON.parse(localStorage.getItem(`workoutPlan_${selectedProfile.name}`)) || {};
    
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

        // Load saved exercises for this day
        if (savedPlan[day.toLowerCase()]) {
            savedPlan[day.toLowerCase()].forEach(exercise => {
                addExerciseToSchedule(day.toLowerCase(), exercise, false);
            });
        }
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
            
            // Special handling for Zumba workouts
            if (category === 'zumba') {
                exerciseItem.innerHTML = `
                    <div class="card mb-3">
                        <img src="${exercise.image}" class="card-img-top" alt="${exercise.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${exercise.name}</h5>
                            <p class="card-text">${exercise.description}</p>
                            <div class="small text-muted">
                                Duration: ${exercise.duration} | Level: ${exercise.level} | Calories: ${exercise.calories}
                            </div>
                            <button class="btn btn-sm btn-outline-primary add-exercise mt-2" 
                                    data-exercise='${JSON.stringify(exercise)}'>
                                Add to Schedule
                            </button>
                        </div>
                    </div>
                `;
            } else {
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
            }
            exerciseList.appendChild(exerciseItem);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add workout button
    document.getElementById('add-workout').addEventListener('click', () => {
        showDaySelectionModal();
    });

    // Add exercise buttons
    document.querySelectorAll('.add-exercise').forEach(button => {
        button.addEventListener('click', (e) => {
            const exercise = JSON.parse(e.target.dataset.exercise);
            showDaySelectionModal(exercise);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.input-group input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterExercises(searchTerm);
    });
}

// Show day selection modal
function showDaySelectionModal(exercise = null) {
    const modalHtml = `
        <div class="modal fade" id="daySelectionModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Select Day</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="day-select" class="form-label">Choose a day:</label>
                            <select class="form-select" id="day-select">
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm-day">Add to Schedule</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('daySelectionModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('daySelectionModal'));
    modal.show();

    // Handle confirm button click
    document.getElementById('confirm-day').addEventListener('click', () => {
        const selectedDay = document.getElementById('day-select').value;
        if (exercise) {
            addExerciseToSchedule(selectedDay, exercise);
        } else {
            const exerciseName = prompt('Enter the exercise name:');
            if (exerciseName) {
                addExerciseToSchedule(selectedDay, exerciseName);
            }
        }
        modal.hide();
    });
}

// Add exercise to schedule
function addExerciseToSchedule(day, exercise, saveToStorage = true) {
    const dayExercises = document.querySelector(`.exercises[data-day="${day}"]`);
    if (dayExercises) {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise-item';
        exerciseElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-bold">${typeof exercise === 'string' ? exercise : exercise.name}</span>
                    <div class="small text-muted">
                        ${exercise.sets ? `Sets: ${exercise.sets} | Reps: ${exercise.reps}` : ''}
                    </div>
                    <div class="workout-timer mt-2" style="display: none;">
                        <span class="timer-display">00:00:00</span>
                        <span class="calories-burned ms-2">(0 calories)</span>
                    </div>
                </div>
                <div class="workout-controls">
                    <button class="btn btn-sm btn-success start-workout">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="btn btn-sm btn-warning stop-workout" style="display: none;">
                        <i class="fas fa-pause"></i> Stop
                    </button>
                    <button class="btn btn-sm btn-danger end-workout" style="display: none;">
                        <i class="fas fa-stop"></i> End
                    </button>
                    <button class="btn btn-sm btn-danger remove-exercise">Remove</button>
                </div>
            </div>
        `;
        dayExercises.appendChild(exerciseElement);

        // Add workout control functionality
        const startButton = exerciseElement.querySelector('.start-workout');
        const stopButton = exerciseElement.querySelector('.stop-workout');
        const endButton = exerciseElement.querySelector('.end-workout');
        const timerDisplay = exerciseElement.querySelector('.timer-display');
        const caloriesDisplay = exerciseElement.querySelector('.calories-burned');
        const workoutTimer = exerciseElement.querySelector('.workout-timer');

        let workoutInterval;
        let startTime;
        let elapsedTime = 0;

        startButton.addEventListener('click', () => {
            startTime = new Date();
            startButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            endButton.style.display = 'inline-block';
            workoutTimer.style.display = 'block';

            workoutInterval = setInterval(() => {
                const now = new Date();
                elapsedTime = Math.floor((now - startTime) / 1000);
                
                // Update timer display
                const hours = Math.floor(elapsedTime / 3600);
                const minutes = Math.floor((elapsedTime % 3600) / 60);
                const seconds = elapsedTime % 60;
                timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                // Calculate and update calories (example calculation)
                const caloriesPerMinute = 10; // This should be based on exercise type and intensity
                const caloriesBurned = Math.floor((elapsedTime / 60) * caloriesPerMinute);
                caloriesDisplay.textContent = `(${caloriesBurned} calories)`;
            }, 1000);
        });

        stopButton.addEventListener('click', () => {
            clearInterval(workoutInterval);
            startButton.style.display = 'inline-block';
            stopButton.style.display = 'none';
            endButton.style.display = 'none';
        });

        endButton.addEventListener('click', () => {
            clearInterval(workoutInterval);
            startButton.style.display = 'inline-block';
            stopButton.style.display = 'none';
            endButton.style.display = 'none';
            workoutTimer.style.display = 'none';

            // Save workout data
            const workoutData = {
                exercise: typeof exercise === 'string' ? exercise : exercise.name,
                duration: elapsedTime,
                calories: Math.floor((elapsedTime / 60) * 10) // Example calculation
            };

            // Save to localStorage
            const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${selectedProfile.name}`)) || [];
            savedWorkouts.push(workoutData);
            localStorage.setItem(`workouts_${selectedProfile.name}`, JSON.stringify(savedWorkouts));

            // Show completion message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
            alertDiv.innerHTML = `
                <strong>Workout completed!</strong> You've burned ${workoutData.calories} calories.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            exerciseElement.appendChild(alertDiv);
        });

        // Add remove functionality
        exerciseElement.querySelector('.remove-exercise').addEventListener('click', () => {
            if (workoutInterval) {
                clearInterval(workoutInterval);
            }
            exerciseElement.remove();
            updateWorkoutSummary(day);
            if (saveToStorage) {
                saveWorkoutPlan();
            }
        });

        // Update workout summary
        updateWorkoutSummary(day);

        // Save to localStorage
        if (saveToStorage) {
            saveWorkoutPlan();
        }
    }
}

// Save workout plan
function saveWorkoutPlan() {
    const plan = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const exercises = document.querySelector(`.exercises[data-day="${day}"]`);
        if (exercises) {
            const exerciseItems = exercises.querySelectorAll('.exercise-item');
            plan[day] = Array.from(exerciseItems).map(item => {
                const name = item.querySelector('.fw-bold').textContent;
                const details = item.querySelector('.text-muted').textContent;
                return { name, details };
            });
        }
    });

    localStorage.setItem(`workoutPlan_${selectedProfile.name}`, JSON.stringify(plan));
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
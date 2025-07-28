// Get selected profile
const selectedProfile = JSON.parse(localStorage.getItem('selectedProfile'));
let activeWorkouts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    if (!selectedProfile) {
        window.location.href = 'profile.html';
        return;
    }

    displayProfileDetails();
    loadWorkoutSchedule();
    updateWeeklySummary();
    initializeProgressTracking();
});

// Display profile details
function displayProfileDetails() {
    const profileNameElement = document.getElementById('profile-name');
    profileNameElement.innerHTML = `
        <div class="d-flex align-items-center">
            <input type="text" class="form-control form-control-lg border-0 bg-transparent" 
                   value="${selectedProfile.name}'s Workout Plans" 
                   id="editable-profile-name" style="width: auto;">
            <button class="btn btn-sm btn-outline-primary ms-2" onclick="saveProfileName()">
                <i class="fas fa-save"></i>
            </button>
        </div>
    `;
    document.getElementById('profile-details').innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <strong>Age:</strong> ${selectedProfile.age}
            </div>
            <div class="col-md-3">
                <strong>Weight:</strong> ${selectedProfile.weight} kg
            </div>
            <div class="col-md-3">
                <strong>Height:</strong> ${selectedProfile.height} cm
            </div>
            <div class="col-md-3">
                <strong>Goal:</strong> ${selectedProfile.goal}
            </div>
        </div>
    `;
}

// Save profile name
function saveProfileName() {
    const newName = document.getElementById('editable-profile-name').value.replace("'s Workout Plans", "").trim();
    if (newName) {
        // Update the profile name in localStorage
        const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        const profileIndex = profiles.findIndex(p => p.name === selectedProfile.name);
        if (profileIndex !== -1) {
            profiles[profileIndex].name = newName;
            localStorage.setItem('profiles', JSON.stringify(profiles));
            
            // Update selected profile
            selectedProfile.name = newName;
            localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
            
            // Update workout plan key in localStorage
            const oldPlan = localStorage.getItem(`workoutPlan_${selectedProfile.name}`);
            if (oldPlan) {
                localStorage.setItem(`workoutPlan_${newName}`, oldPlan);
                localStorage.removeItem(`workoutPlan_${selectedProfile.name}`);
            }
            
            // Update progress data key in localStorage
            const oldProgress = localStorage.getItem(`progress_${selectedProfile.name}`);
            if (oldProgress) {
                localStorage.setItem(`progress_${newName}`, oldProgress);
                localStorage.removeItem(`progress_${selectedProfile.name}`);
            }
            
            // Refresh the display
            displayProfileDetails();
        }
    }
}

// Load workout schedule
function loadWorkoutSchedule() {
    const schedule = document.getElementById('workout-schedule');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const savedPlan = JSON.parse(localStorage.getItem(`workoutPlan_${selectedProfile.name}`)) || {};
    
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-schedule mb-4';
        dayElement.innerHTML = `
            <h6 class="mb-3">${day}</h6>
            <div class="exercises" data-day="${day.toLowerCase()}">
                ${savedPlan[day.toLowerCase()] ? 
                    savedPlan[day.toLowerCase()].map((exercise, index) => `
                        <div class="exercise-item p-3 border rounded mb-2" data-exercise-id="${day.toLowerCase()}-${index}">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="fw-bold">${exercise.name}</span>
                                    <div class="small text-muted">${exercise.details}</div>
                                    <div class="workout-timer mt-2" style="display: none;">
                                        <span class="timer-display">00:00:00</span>
                                        <span class="calories-burned ms-2">(0 calories)</span>
                                    </div>
                                </div>
                                <div class="workout-controls">
                                    <button class="btn btn-sm btn-success start-workout" onclick="startWorkout('${day.toLowerCase()}-${index}')">
                                        <i class="fas fa-play"></i> Start
                                    </button>
                                    <button class="btn btn-sm btn-warning stop-workout" onclick="stopWorkout('${day.toLowerCase()}-${index}')" style="display: none;">
                                        <i class="fas fa-pause"></i> Stop
                                    </button>
                                    <button class="btn btn-sm btn-danger end-workout" onclick="endWorkout('${day.toLowerCase()}-${index}')" style="display: none;">
                                        <i class="fas fa-stop"></i> End
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('') : 
                    '<div class="text-muted">No exercises scheduled</div>'
                }
            </div>
        `;
        schedule.appendChild(dayElement);
    });
}

// Start workout
function startWorkout(exerciseId) {
    const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    const startButton = exerciseElement.querySelector('.start-workout');
    const stopButton = exerciseElement.querySelector('.stop-workout');
    const endButton = exerciseElement.querySelector('.end-workout');
    const timerDisplay = exerciseElement.querySelector('.timer-display');
    const caloriesDisplay = exerciseElement.querySelector('.calories-burned');
    const workoutTimer = exerciseElement.querySelector('.workout-timer');

    // Hide start button, show stop and end buttons
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    endButton.style.display = 'inline-block';
    workoutTimer.style.display = 'block';

    // Initialize workout tracking
    activeWorkouts[exerciseId] = {
        startTime: new Date(),
        elapsedTime: 0,
        timerInterval: setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - activeWorkouts[exerciseId].startTime) / 1000);
            activeWorkouts[exerciseId].elapsedTime = elapsed;
            
            // Update timer display
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Calculate and update calories (example calculation)
            const caloriesPerMinute = 10; // This should be based on exercise type and intensity
            const caloriesBurned = Math.floor((elapsed / 60) * caloriesPerMinute);
            caloriesDisplay.textContent = `(${caloriesBurned} calories)`;
        }, 1000)
    };
}

// Stop workout
function stopWorkout(exerciseId) {
    const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    const startButton = exerciseElement.querySelector('.start-workout');
    const stopButton = exerciseElement.querySelector('.stop-workout');
    const endButton = exerciseElement.querySelector('.end-workout');

    // Clear the timer interval
    clearInterval(activeWorkouts[exerciseId].timerInterval);
    
    // Show start button, hide stop button
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    endButton.style.display = 'inline-block';
}

// End workout
function endWorkout(exerciseId) {
    const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    const startButton = exerciseElement.querySelector('.start-workout');
    const stopButton = exerciseElement.querySelector('.stop-workout');
    const endButton = exerciseElement.querySelector('.end-workout');
    const workoutTimer = exerciseElement.querySelector('.workout-timer');

    // Clear the timer interval
    clearInterval(activeWorkouts[exerciseId].timerInterval);
    
    // Calculate final stats
    const elapsedTime = activeWorkouts[exerciseId].elapsedTime;
    const caloriesPerMinute = 10; // This should be based on exercise type and intensity
    const caloriesBurned = Math.floor((elapsedTime / 60) * caloriesPerMinute);

    // Update progress data
    let progressData = JSON.parse(localStorage.getItem(`progress_${selectedProfile.name}`)) || {
        workoutsCompleted: 0,
        totalWorkouts: 0,
        caloriesBurned: 0,
        goalProgress: 0
    };

    progressData.workoutsCompleted++;
    progressData.caloriesBurned += caloriesBurned;

    localStorage.setItem(`progress_${selectedProfile.name}`, JSON.stringify(progressData));

    // Reset display
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    endButton.style.display = 'none';
    workoutTimer.style.display = 'none';

    // Remove from active workouts
    delete activeWorkouts[exerciseId];

    // Update progress tracking
    initializeProgressTracking();
    updateWeeklySummary();

    // Show completion message
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-3"></i>
            <div>
                <strong>Workout Completed!</strong>
                <p class="mb-0">Time: ${Math.floor(elapsedTime / 60)} minutes | Calories Burned: ${caloriesBurned}</p>
            </div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.row'));
}

// Update weekly summary
function updateWeeklySummary() {
    const summary = document.getElementById('weekly-summary');
    const savedPlan = JSON.parse(localStorage.getItem(`workoutPlan_${selectedProfile.name}`)) || {};
    let totalExercises = 0;
    let totalTime = 0;
    let totalCalories = 0;

    Object.values(savedPlan).forEach(dayExercises => {
        dayExercises.forEach(exercise => {
            totalExercises++;
            const timeMatch = exercise.details.match(/Duration: (\d+) min/);
            const caloriesMatch = exercise.details.match(/Calories: (\d+)/);
            
            if (timeMatch) totalTime += parseInt(timeMatch[1]);
            if (caloriesMatch) totalCalories += parseInt(caloriesMatch[1]);
        });
    });

    // Add completed workout calories
    const progressData = JSON.parse(localStorage.getItem(`progress_${selectedProfile.name}`)) || {
        caloriesBurned: 0
    };
    totalCalories += progressData.caloriesBurned;

    summary.innerHTML = `
        <div class="row text-center">
            <div class="col-4">
                <div class="summary-item">
                    <h3 class="text-primary">${totalExercises}</h3>
                    <div class="text-muted">Total Exercises</div>
                </div>
            </div>
            <div class="col-4">
                <div class="summary-item">
                    <h3 class="text-primary">${totalTime}</h3>
                    <div class="text-muted">Total Minutes</div>
                </div>
            </div>
            <div class="col-4">
                <div class="summary-item">
                    <h3 class="text-primary">${totalCalories}</h3>
                    <div class="text-muted">Total Calories</div>
                </div>
            </div>
        </div>
    `;
}

// Initialize progress tracking
function initializeProgressTracking() {
    const tracking = document.getElementById('progress-tracking');
    const goal = selectedProfile.goal;
    let progressData = JSON.parse(localStorage.getItem(`progress_${selectedProfile.name}`)) || {
        workoutsCompleted: 0,
        totalWorkouts: 0,
        caloriesBurned: 0,
        goalProgress: 0
    };

    // Update progress data
    const savedPlan = JSON.parse(localStorage.getItem(`workoutPlan_${selectedProfile.name}`)) || {};
    progressData.totalWorkouts = Object.values(savedPlan).reduce((total, day) => total + day.length, 0);

    tracking.innerHTML = `
        <div class="progress mb-3">
            <div class="progress-bar" role="progressbar" 
                 style="width: ${(progressData.workoutsCompleted / progressData.totalWorkouts * 100) || 0}%">
                ${Math.round((progressData.workoutsCompleted / progressData.totalWorkouts * 100) || 0)}%
            </div>
        </div>
        <div class="row text-center">
            <div class="col-6">
                <div class="tracking-item">
                    <h4 class="text-primary">${progressData.workoutsCompleted}</h4>
                    <div class="text-muted">Workouts Completed</div>
                </div>
            </div>
            <div class="col-6">
                <div class="tracking-item">
                    <h4 class="text-primary">${progressData.caloriesBurned}</h4>
                    <div class="text-muted">Calories Burned</div>
                </div>
            </div>
        </div>
    `;
} 
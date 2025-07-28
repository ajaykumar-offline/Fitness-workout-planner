// Profile Management
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
const MAX_PROFILES = 5;
let selectedProfile = JSON.parse(localStorage.getItem('selectedProfile')) || null;

// Initialize profiles
function initializeProfiles() {
    const profileList = document.getElementById('profile-list');
    profileList.innerHTML = '';
    
    profiles.forEach((profile, index) => {
        const profileElement = createProfileElement(profile, index);
        profileList.appendChild(profileElement);
    });

    // Add profile selection functionality
    document.querySelectorAll('.profile-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-profile')) {
                const index = item.dataset.index;
                selectProfile(index);
            }
        });
    });
}

// Create profile element
function createProfileElement(profile, index) {
    const div = document.createElement('div');
    div.className = `profile-item mb-3 p-3 border rounded ${selectedProfile && selectedProfile.name === profile.name ? 'selected-profile' : ''}`;
    div.dataset.index = index;
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="profile-avatar me-3">
                    <div class="avatar-circle">
                        <span>${profile.name.charAt(0).toUpperCase()}</span>
                    </div>
                </div>
                <div>
                    <h5 class="mb-1">${profile.name}</h5>
                    <div class="small text-muted">
                        Age: ${profile.age} | Weight: ${profile.weight}kg | Height: ${profile.height}cm
                    </div>
                    <div class="small text-muted">Goal: ${profile.goal}</div>
                </div>
            </div>
            <div class="d-flex align-items-center">
                ${selectedProfile && selectedProfile.name === profile.name ? 
                    '<div class="profile-status me-3"><span class="status-dot"></span><span class="status-text">Active</span></div>' : ''}
                <button class="btn btn-sm btn-danger delete-profile" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return div;
}

// Select profile
function selectProfile(index) {
    const previousProfile = selectedProfile;
    selectedProfile = profiles[index];
    localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
    
    // Animate profile switch
    const profileItems = document.querySelectorAll('.profile-item');
    profileItems.forEach(item => {
        item.classList.remove('selected-profile');
        item.style.transform = 'scale(1)';
    });

    const selectedItem = profileItems[index];
    selectedItem.classList.add('selected-profile');
    selectedItem.style.transform = 'scale(1.02)';

    // Show success message with animation
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show profile-switch-alert';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="profile-switch-icon me-3">
                <i class="fas fa-check-circle"></i>
            </div>
            <div>
                <strong>Profile Switched!</strong>
                <p class="mb-0">Redirecting to ${selectedProfile.name}'s workout plans...</p>
            </div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Remove existing alert if any
    const existingAlert = document.querySelector('.profile-switch-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.row'));
    
    // Add animation classes
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 100);

    // Redirect to profile plans page after a short delay
    setTimeout(() => {
        window.location.href = 'profile-plans.html';
    }, 1500);
}

// Save profile
function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const age = document.getElementById('profile-age').value;
    const weight = document.getElementById('profile-weight').value;
    const height = document.getElementById('profile-height').value;
    const goal = document.getElementById('profile-goal').value;

    if (profiles.length >= MAX_PROFILES) {
        showErrorAlert('Maximum number of profiles reached (5)');
        return;
    }

    const profile = { name, age, weight, height, goal };
    profiles.push(profile);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    
    // If this is the first profile, select it automatically
    if (profiles.length === 1) {
        selectProfile(0);
    }
    
    initializeProfiles();
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    document.getElementById('profile-form').reset();
}

// Delete profile
function deleteProfile(index) {
    if (selectedProfile && selectedProfile.name === profiles[index].name) {
        selectedProfile = null;
        localStorage.removeItem('selectedProfile');
    }
    profiles.splice(index, 1);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    initializeProfiles();
}

// Show error alert
function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-exclamation-circle me-3"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.row'));
}

// Setup profile event listeners
function setupProfileEventListeners() {
    document.getElementById('save-profile').addEventListener('click', saveProfile);
    
    document.getElementById('profile-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-profile') || e.target.closest('.delete-profile')) {
            const index = e.target.closest('.profile-item').dataset.index;
            if (confirm('Are you sure you want to delete this profile?')) {
                deleteProfile(index);
            }
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeProfiles();
    setupProfileEventListeners();
}); 
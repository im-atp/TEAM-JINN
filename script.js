let birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];

// Form submission handler with animation
document.getElementById('birthdayForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newBirthday = {
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        photo: document.getElementById('photo').value
    };

    birthdays.push(newBirthday);
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
    
    this.reset();
    updateUpcomingBirthdays();
    
    // Show success message with animation
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.background = 'var(--primary)';
    message.style.color = 'white';
    message.style.padding = '1rem 2rem';
    message.style.borderRadius = '10px';
    message.style.animation = 'fadeIn 0.3s ease';
    message.innerHTML = '<i class="fas fa-check-circle"></i> Birthday added successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
});

// Function to calculate days until next birthday
function daysUntilBirthday(dobString) {
    const today = new Date();
    const dob = new Date(dobString);
    
    const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Update upcoming birthdays display with animations
function updateUpcomingBirthdays() {
    const container = document.getElementById('upcomingBirthdays');
    container.innerHTML = '';

    const sortedBirthdays = [...birthdays].sort((a, b) => {
        return daysUntilBirthday(a.dob) - daysUntilBirthday(b.dob);
    });

    sortedBirthdays.forEach((birthday, index) => {
        const days = daysUntilBirthday(birthday.dob);
        const card = document.createElement('div');
        card.className = 'birthday-card';
        card.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${birthday.photo}" alt="${birthday.name}" onerror="this.src='/api/placeholder/120/120'">
            <h3>${birthday.name}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${new Date(birthday.dob).toLocaleDateString()}</p>
            <p><i class="fas fa-hourglass-half"></i> ${days} days until birthday</p>
            <button onclick="deleteBirthday(${index})">Delete</button>
        `;
        
        container.appendChild(card);
    });
}

// Check for birthdays on load
updateUpcomingBirthdays();

// Check for birthdays every day
setInterval(updateUpcomingBirthdays, 24 * 60 * 60 * 1000);

// Delete birthday function with confirmation for everyone
function deleteBirthday(index) {
    const confirmed = confirm('Are you sure you want to delete this birthday?');
    if (confirmed) {
        birthdays.splice(index, 1);
        localStorage.setItem('birthdays', JSON.stringify(birthdays));
        updateUpcomingBirthdays();
        alert('Birthday deleted successfully!');
    }
}

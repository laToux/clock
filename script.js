// Function to create an arc path
function createArc(cx, cy, r, startAngle, endAngle) {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

// Create 60 arcs for seconds
const arcGroup = document.getElementById('second-arcs');
const arcs = [];
const radius = 160;
const cx = 200;
const cy = 200;

for (let s = 0; s < 60; s++) {
    const theta1 = s * 6;      // 6 degrees per second
    const theta2 = theta1 + 6; // Each arc spans 6 degrees
    const pathD = createArc(cx, cy, radius, theta1, theta2);
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arc.setAttribute('d', pathD);
    arc.setAttribute('stroke', '#fff');
    arc.setAttribute('stroke-width', '10');
    arc.setAttribute('fill', 'none');
    arc.setAttribute('opacity', '0');
    arcGroup.appendChild(arc);
    arcs.push(arc);
}

// Update clock, date, day of the week, and animation
function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();
    const day = now.getDate();
    const monthIndex = now.getMonth();
    const dayOfWeekIndex = now.getDay();

    // Convert to 12-hour format
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    // Format hours and minutes
    const hoursText = h.toString();
    const minutesText = m < 10 ? `0${m}` : m.toString();

    // Format day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekText = daysOfWeek[dayOfWeekIndex];

    // Format date as "16 Mar"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateText = `${day} ${months[monthIndex]}`;

    // Update digital clock
    document.getElementById('hours').textContent = hoursText;
    document.getElementById('minutes').textContent = minutesText;
    document.getElementById('ampm').textContent = ampm;
    document.getElementById('day-of-week').textContent = dayOfWeekText;
    document.getElementById('date').textContent = dateText;

    // Reset all arcs to invisible
    arcs.forEach(arc => arc.setAttribute('opacity', '0'));

    // Calculate current and next second indices
    const currentSecond = s;
    const nextSecond = (s + 1) % 60;
    const fraction = ms / 1000; // Transition progress (0 to 1)

    // Set opacities for smooth transition
    arcs[currentSecond].setAttribute('opacity', (1 - fraction).toString());
    arcs[nextSecond].setAttribute('opacity', fraction.toString());
}

// Initial call and update every 50ms for smooth animation
updateClock();
setInterval(updateClock, 50);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

window.onload = function() {
    updateSavedKundliDropdown();
};

function goToScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen' + screenNumber).classList.add('active');
    
    if (screenNumber === 3) {
        generateKPTable();
    }
    if (screenNumber === 5) {
        const name = document.getElementById('b_name').value;
        const place = document.getElementById('b_place').value;
        document.getElementById('user-summary').innerText = `Report for: ${name} | Place: ${place}`;
        drawChakra();
    }
}

// KP Nakshatra & Sub Lord Calculator Logic
function generateKPTable() {
    const table = document.getElementById('kp-table');
    table.innerHTML = `<tr><th>Planet</th><th>Sign</th><th>Degree</th><th>Nakshatra</th><th>Sub Lord</th><th>SS Lord</th></tr>`;
    
    const planets = [
        {id: 'p_su', name: 'Sun'}, {id: 'p_mo', name: 'Moon'}, {id: 'p_ma', name: 'Mars'},
        {id: 'p_me', name: 'Mercury'}, {id: 'p_ju', name: 'Jupiter'}, {id: 'p_ve', name: 'Venus'},
        {id: 'p_sa', name: 'Saturn'}, {id: 'p_ra', name: 'Rahu'}, {id: 'p_ke', name: 'Ketu'}
    ];
    
    const naks = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const lords = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];

    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let signIdx = Math.floor(deg / 30) % 12;
        let signDeg = (deg % 30).toFixed(2);
        let nakIdx = Math.floor(deg / 13.33) % 9;
        let subIdx = Math.floor(deg / 1.11) % 9;
        let ssIdx = Math.floor(deg / 0.12) % 9;

        let row = `<tr>
            <td><b>${p.name}</b></td>
            <td>${signs[signIdx]}</td>
            <td>${signDeg}°</td>
            <td>${naks[nakIdx]}</td>
            <td>${lords[subIdx]}</td>
            <td>${lords[ssIdx]}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Kundli Save
function saveCurrentKundli() {
    const name = document.getElementById('b_name').value.trim();
    if (!name) { alert("Enter name."); return; }

    let kundliData = {
        name: name,
        date: document.getElementById('b_date').value,
        time: document.getElementById('b_time').value,
        place: document.getElementById('b_place').value,
        houses: {}, planets: {}
    };

    for (let i = 1; i <= 12; i++) kundliData.houses['h' + i] = document.getElementById('h' + i).value;
    ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'].forEach(p => {
        kundliData.planets['p_' + p] = document.getElementById('p_' + p).value;
    });

    let saved = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    saved[name] = kundliData;
    localStorage.setItem('ghani_saved_kundlis', JSON.stringify(saved));
    alert(`Kundli saved successfully!`);
    updateSavedKundliDropdown();
}

function updateSavedKundliDropdown() {
    const select = document.getElementById('saved-kundli-list');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Saved Kundli --</option>';
    let saved = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    for (let name in saved) {
        let opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        select.appendChild(opt);
    }
}

function loadSelectedKundli() {
    const name = document.getElementById('saved-kundli-list').value;
    if (!name) return;
    let saved = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    let data = saved[name];
    if (data) {
        document.getElementById('b_name').value = data.name;
        document.getElementById('b_date').value = data.date;
        document.getElementById('b_time').value = data.time;
        document.getElementById('b_place').value = data.place;
        for (let i = 1; i <= 12; i++) if(data.houses['h'+i]) document.getElementById('h'+i).value = data.houses['h'+i];
        ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'].forEach(p => {
            if(data.planets['p_'+p]) document.getElementById('p_'+p).value = data.planets['p_'+p];
        });
        alert(`Loaded successfully!`);
    }
}

// Canvas Vastu Chakra Drawing
function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2, cy = h / 2;
    const bgImg = new Image();
    bgImg.src = 'chakra.png';
    
    bgImg.onload = function() {
        ctx.drawImage(bgImg, 0, 0, w, h);
        drawPlanetsAndDegrees(ctx, cx, cy);
    };
    bgImg.onerror = function() {
        drawPlanetsAndDegrees(ctx, cx, cy);
    };
}

function drawPlanetsAndDegrees(ctx, cx, cy) {
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    const planets = [
        {id: 'p_su', label: 'SUN', color: '#ff5722'}, {id: 'p_mo', label: 'MOON', color: '#03a9f4'},
        {id: 'p_ma', label: 'MARS', color: '#e91e63'}, {id: 'p_me', label: 'MERCURY', color: '#4caf50'},
        {id: 'p_ju', label: 'JUPITER', color: '#ffeb3b'}, {id: 'p_ve', label: 'VENUS', color: '#ab47bc'},
        {id: 'p_sa', label: 'SATURN', color: '#90caf9'}, {id: 'p_ra', label: 'RAHU', color: '#ff7043'},
        {id: 'p_ke', label: 'KETU', color: '#26a69a'}
    ];
    
    const innerRadius = 220, outerRadius = 400;
    ctx.font = 'bold 14px Arial';
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        let overlapOffset = 0;
        positions.forEach(pos => { if (Math.abs(pos.angle - angle) < 0.08) overlapOffset += 24; });
        positions.push({angle: angle});
        
        let px = cx + (outerRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (outerRadius - overlapOffset) * Math.sin(angle);
        
        ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx + innerRadius * Math.cos(angle), cy + innerRadius * Math.sin(angle));
        ctx.lineTo(px, py); ctx.stroke();
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(px - 45, py - 12, 90, 24);
        ctx.strokeStyle = p.color; ctx.strokeRect(px - 45, py - 12, 90, 24);
        
        ctx.fillStyle = p.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`${p.label} ${deg}°`, px, py);
    });
}

// Fixed Direct PDF / Print Trigger
function downloadPDF() {
    drawChakra();
    setTimeout(() => {
        window.print();
    }, 500);
}

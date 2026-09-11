// App Load par saved kundlis list update karein
window.onload = function() {
    updateSavedKundliDropdown();
};

function goToScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen' + screenNumber).classList.add('active');
    
    if (screenNumber === 3) {
        const name = document.getElementById('b_name').value;
        const place = document.getElementById('b_place').value;
        const date = document.getElementById('b_date').value;
        document.getElementById('user-summary').innerText = `Report for: ${name} | Place: ${place} | Date: ${date}`;
        drawChakra();
    }
}

// Kundli Save karne ka function
function saveCurrentKundli() {
    const name = document.getElementById('b_name').value.trim();
    if (!name) {
        alert("Please enter a name for the kundli.");
        return;
    }

    let kundliData = {
        name: name,
        date: document.getElementById('b_date').value,
        time: document.getElementById('b_time').value,
        place: document.getElementById('b_place').value,
        houses: {},
        planets: {}
    };

    // Houses degrees capture
    for (let i = 1; i <= 12; i++) {
        kundliData.houses['h' + i] = document.getElementById('h' + i).value;
    }

    // Planets degrees capture
    const pList = ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'];
    pList.forEach(p => {
        kundliData.planets['p_' + p] = document.getElementById('p_' + p).value;
    });

    // LocalStorage me save karna
    let savedKundlis = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    savedKundlis[name] = kundliData;
    localStorage.setItem('ghani_saved_kundlis', JSON.stringify(savedKundlis));

    alert(`Kundli for "${name}" saved successfully!`);
    updateSavedKundliDropdown();
}

// Dropdown list ko update karna
function updateSavedKundliDropdown() {
    const select = document.getElementById('saved-kundli-list');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select Saved Kundli --</option>';
    let savedKundlis = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    
    for (let name in savedKundlis) {
        let opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        select.appendChild(opt);
    }
}

// Dropdown se select karne par data wapas form me load karna
function loadSelectedKundli() {
    const name = document.getElementById('saved-kundli-list').value;
    if (!name) return;

    let savedKundlis = JSON.parse(localStorage.getItem('ghani_saved_kundlis')) || {};
    let data = savedKundlis[name];

    if (data) {
        document.getElementById('b_name').value = data.name;
        document.getElementById('b_date').value = data.date;
        document.getElementById('b_time').value = data.time;
        document.getElementById('b_place').value = data.place;

        for (let i = 1; i <= 12; i++) {
            if(data.houses['h' + i] !== undefined) {
                document.getElementById('h' + i).value = data.houses['h' + i];
            }
        }

        const pList = ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'];
        pList.forEach(p => {
            if(data.planets['p_' + p] !== undefined) {
                document.getElementById('p_' + p).value = data.planets['p_' + p];
            }
        });

        alert(`Kundli for "${name}" loaded successfully!`);
    }
}

function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
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
        {id: 'p_su', label: 'SUN', color: '#ff5722'},
        {id: 'p_mo', label: 'MOON', color: '#03a9f4'},
        {id: 'p_ma', label: 'MARS', color: '#e91e63'},
        {id: 'p_me', label: 'MERCURY', color: '#4caf50'},
        {id: 'p_ju', label: 'JUPITER', color: '#ffeb3b'},
        {id: 'p_ve', label: 'VENUS', color: '#ab47bc'},
        {id: 'p_sa', label: 'SATURN', color: '#90caf9'},
        {id: 'p_ra', label: 'RAHU', color: '#ff7043'},
        {id: 'p_ke', label: 'KETU', color: '#26a69a'}
    ];
    
    const innerRadius = 220; 
    const outerRadius = 400; 
    
    ctx.font = 'bold 14px Arial';
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.08) {
                overlapOffset += 24; 
            }
        });
        positions.push({angle: angle});
        
        let px = cx + (outerRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (outerRadius - overlapOffset) * Math.sin(angle);
        
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + innerRadius * Math.cos(angle), cy + innerRadius * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(px - 45, py - 12, 90, 24);
        ctx.strokeStyle = p.color;
        ctx.strokeRect(px - 45, py - 12, 90, 24);
        
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${p.label} ${deg}°`, px, py);
    });
}

function downloadPDF() {
    const canvas = document.getElementById('astroCanvas');
    const name = document.getElementById('b_name').value;
    const place = document.getElementById('b_place').value;
    const dataUrl = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ghani Astro Vastu Chakra Report</title>
                <style>
                    body { text-align: center; background: white; margin: 0; padding: 20px; font-family: Arial; }
                    img { max-width: 100%; height: auto; margin-top: 15px; border-radius: 50%; }
                    h2 { color: #d35400; margin-bottom: 2px; }
                    p { color: #555; font-size: 14px; }
                </style>
            </head>
            <body>
                <h2>Ghani Astro Vastu Chakra Report</h2>
                <p><b>Name:</b> ${name} | <b>Place:</b> ${place}</p>
                <br>
                <img src="${dataUrl}" />
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 800);
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

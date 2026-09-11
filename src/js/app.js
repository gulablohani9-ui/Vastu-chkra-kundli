function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    // High-DPI Canvas scaling for better PDF quality
    ctx.clearRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2.5;
    
    // Concentric Circles
    const radii = [120, 260, 380];
    radii.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
    });
    
    // Utility to convert degree to canvas angle (0 degrees at Top)
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    
    // Houses inputs
    const houses = [];
    for(let i=1; i<=12; i++) {
        houses.push(parseFloat(document.getElementById('h'+i).value) || 0);
    }
    
    // Draw House Boundaries and Labels
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    for(let i=0; i<12; i++) {
        let deg = houses[i];
        let angle = getAngle(deg);
        
        // Draw House Cusp Line
        ctx.strokeStyle = '#7f8c8d';
        ctx.setLineDash([5, 5]); // Dashed lines for houses
        ctx.beginPath();
        ctx.moveTo(cx + radii[0] * Math.cos(angle), cy + radii[0] * Math.sin(angle));
        ctx.lineTo(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle));
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
        
        // Calculate middle angle for Label
        let nextDeg = houses[(i+1)%12];
        if (nextDeg <= deg) nextDeg += 360;
        let midDeg = (deg + nextDeg) / 2;
        let midAngle = getAngle(midDeg);
        
        // Draw House Number
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#c0392b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let labelR = (radii[0] + radii[1]) / 2;
        ctx.fillText(roman[i], cx + labelR * Math.cos(midAngle), cy + labelR * Math.sin(midAngle));
    }
    
    // Draw Planets
    const planets = [
        {id: 'p_su', label: 'Sun', color: '#d35400'},
        {id: 'p_mo', label: 'Moon', color: '#2980b9'},
        {id: 'p_ma', label: 'Mars', color: '#c0392b'},
        {id: 'p_me', label: 'Mercury', color: '#27ae60'},
        {id: 'p_ju', label: 'Jupiter', color: '#f39c12'},
        {id: 'p_ve', label: 'Venus', color: '#8e44ad'},
        {id: 'p_sa', label: 'Saturn', color: '#2c3e50'},
        {id: 'p_ra', label: 'Rahu', color: '#34495e'},
        {id: 'p_ke', label: 'Ketu', color: '#34495e'}
    ];
    
    ctx.font = 'bold 18px Arial';
    
    // To handle overlapping planets, we map angles
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        let labelR = (radii[1] + radii[2]) / 2;
        
        // Simple offset for overlapping texts
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.1) {
                overlapOffset += 22; // Offset text by 22 pixels
            }
        });
        positions.push({angle: angle});
        
        ctx.fillStyle = p.color;
        let px = cx + labelR * Math.cos(angle);
        let py = cy + labelR * Math.sin(angle) + overlapOffset;
        
        // Draw Text
        ctx.fillText(p.label + ` (${deg}°)`, px, py);
        
        // Draw Planet Node Marker
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle), 6, 0, 2*Math.PI);
        ctx.fill();
    });
    
    // Draw Center Branding
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('ASTRO', cx, cy - 15);
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#7f8c8d';
    ctx.fillText('Vastu Chakra', cx, cy + 15);
}

function downloadPDF() {
    drawChakra(); 
    const element = document.getElementById('pdf-content');
    const opt = {
      margin:       0.5,
      filename:     'Harsh_Astro_Vastu_Chakra.pdf',
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 3, useCORS: true }, 
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

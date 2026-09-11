function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // सफेद बैकग्राउंड
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // 1. चक्र की मुख्य गोलाकार रेखाएं (कंसेंट्रिक सर्कल्स)
    const radii = [130, 270, 390];
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    radii.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
    });
    
    // 2. भावों (Houses I to XII) की लाइनें और नंबर
    const houses = [];
    for(let i=1; i<=12; i++) {
        houses.push(parseFloat(document.getElementById('h'+i).value) || 0);
    }
    
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    for(let i=0; i<12; i++) {
        let deg = houses[i];
        let angle = getAngle(deg);
        
        // भाव की कस्प लाइन (Cusp Line)
        ctx.strokeStyle = '#7f8c8d';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx + radii[0] * Math.cos(angle), cy + radii[0] * Math.sin(angle));
        ctx.lineTo(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle));
        ctx.stroke();
        ctx.setLineDash([]);
        
        // भाव का रोमन नंबर (I, II, III...) बीच में दिखाना
        let nextDeg = houses[(i+1)%12];
        if (nextDeg <= deg) nextDeg += 360;
        let midDeg = (deg + nextDeg) / 2;
        let midAngle = getAngle(midDeg);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#c0392b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let labelR = (radii[0] + radii[1]) / 2;
        ctx.fillText(roman[i], cx + labelR * Math.cos(midAngle), cy + labelR * Math.sin(midAngle));
    }
    
    // 3. ग्रहों (Planets) को डिग्री के अनुसार और उनकी बाहरी लाइनों को ड्रा करना
    const planets = [
        {id: 'p_su', label: 'SUN', color: '#d35400'},
        {id: 'p_mo', label: 'MOON', color: '#2980b9'},
        {id: 'p_ma', label: 'MARS', color: '#c0392b'},
        {id: 'p_me', label: 'MERCURY', color: '#27ae60'},
        {id: 'p_ju', label: 'JUPITER', color: '#d68910'},
        {id: 'p_ve', label: 'VENUS', color: '#8e44ad'},
        {id: 'p_sa', label: 'SATURN', color: '#2c3e50'},
        {id: 'p_ra', label: 'RAHU', color: '#415b76'},
        {id: 'p_ke', label: 'KETU', color: '#415b76'}
    ];
    
    ctx.font = 'bold 16px Arial';
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        
        // बाहरी रिंग का रेडियस जहाँ ग्रह और उनके एट्रीब्यूट्स दिखेंगे
        let planetRadius = 430; 
        
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.08) {
                overlapOffset += 24; // अगर ग्रह पास हों तो टेक्स्ट ओवरलैप न हो
            }
        });
        positions.push({angle: angle});
        
        let px = cx + (planetRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (planetRadius - overlapOffset) * Math.sin(angle);
        
        // चक्र के घेरे से बाहर ग्रह तक की कनेक्टिंग लाइन (जो आपने PDF में माँगी है)
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();
        
        // ग्रह का नाम और डिग्री बॉक्स
        ctx.fillStyle = '#f8f9f9';
        ctx.fillRect(px - 45, py - 12, 90, 24);
        ctx.strokeStyle = p.color;
        ctx.strokeRect(px - 45, py - 12, 90, 24);
        
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${p.label} (${deg}°)`, px, py);
    });
}

// 100% काम करने वाला प्रिंट/PDF एक्सपोर्ट फंक्शन
function downloadPDF() {
    drawChakra();
    // मोबाइल और वेब दोनों के लिए डायरेक्ट प्रिंट/सेव टू पीडीएफ कमांड
    window.print();
}

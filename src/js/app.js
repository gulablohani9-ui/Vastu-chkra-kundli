function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // 1. बैकग्राउंड इमेज लोड करें (आपका ओरिजिनल चक्र)
    const img = new Image();
    img.src = 'chakra_bg.png'; // आपकी फाइल का नाम
    
    img.onload = function() {
        // इमेज ड्रा करें
        ctx.drawImage(img, 0, 0, w, h);
        
        // 2. ग्रहों को डिग्री के हिसाब से ऊपर ड्रा करें
        drawPlanets(ctx, w/2, h/2);
    };
    
    // अगर इमेज लोड न हो, तो भी ग्रह ड्रा हो जाएं
    img.onerror = function() {
        drawPlanets(ctx, w/2, h/2);
    };
}

function drawPlanets(ctx, cx, cy) {
    // 0 डिग्री को ऊपर (North) सेट करने के लिए फॉर्मूला
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    
    // जिस घेरे (Radius) में ग्रहों को दिखाना है
    // आप अपनी बैकग्राउंड इमेज के हिसाब से इसे कम या ज्यादा (उदा. 250 या 300) कर सकते हैं
    const planetRadius = 320; 
    
    const planets = [
        {id: 'p_su', label: 'SU', color: '#e74c3c'},
        {id: 'p_mo', label: 'MO', color: '#3498db'},
        {id: 'p_ma', label: 'MA', color: '#c0392b'},
        {id: 'p_me', label: 'ME', color: '#2ecc71'},
        {id: 'p_ju', label: 'JU', color: '#f1c40f'},
        {id: 'p_ve', label: 'VE', color: '#9b59b6'},
        {id: 'p_sa', label: 'SA', color: '#34495e'},
        {id: 'p_ra', label: 'RA', color: '#7f8c8d'},
        {id: 'p_ke', label: 'KE', color: '#7f8c8d'}
    ];
    
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        
        // अगर दो ग्रह एक ही डिग्री पर हों, तो टेक्स्ट को थोड़ा खिसकाने का लॉजिक
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.05) {
                overlapOffset += 25; 
            }
        });
        positions.push({angle: angle});
        
        let px = cx + (planetRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (planetRadius - overlapOffset) * Math.sin(angle);
        
        // ग्रह का नाम और डिग्री लिखें
        ctx.fillStyle = '#ffffff'; // टेक्स्ट के पीछे हल्का बैकग्राउंड ताकि फोटो पर साफ़ दिखे
        ctx.fillRect(px - 15, py - 10, 30, 20);
        
        ctx.fillStyle = p.color;
        ctx.fillText(p.label, px, py);
    });
}

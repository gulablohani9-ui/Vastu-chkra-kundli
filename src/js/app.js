function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // 1. आपकी असली PNG इमेज को बैकग्राउंड के रूप में लोड करना
    const bgImg = new Image();
    bgImg.src = 'chakra.png'; // आपकी इमेज का नाम
    
    bgImg.onload = function() {
        // इमेज को कैनवास पर फिट करना
        ctx.drawImage(bgImg, 0, 0, w, h);
        // इमेज लोड होने के बाद उसके ऊपर ग्रह ड्रा करना
        drawPlanetsAndDegrees(ctx, w/2, h/2);
    };
    
    // अगर इमेज लोड होने में कोई दिक्कत हो, तो भी कोड एरर न दे और ग्रह ड्रा कर दे
    bgImg.onerror = function() {
        ctx.fillStyle = '#111111'; // डार्क बैकग्राउंड
        ctx.fillRect(0, 0, w, h);
        drawPlanetsAndDegrees(ctx, w/2, h/2);
    };
}

function drawPlanetsAndDegrees(ctx, cx, cy) {
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    
    // ग्रहों की लिस्ट
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
    
    // आपकी इमेज के हिसाब से ग्रहों की पोजीशन का दायरा (Radius)
    const innerRadius = 240; // चक्र का अंदरूनी हिस्सा
    const outerRadius = 380; // चक्र का बाहरी हिस्सा जहाँ ग्रह दिखेंगे
    
    ctx.font = 'bold 14px Arial';
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.08) {
                overlapOffset += 22; // ओवरलैप रोकने के लिए
            }
        });
        positions.push({angle: angle});
        
        let px = cx + (outerRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (outerRadius - overlapOffset) * Math.sin(angle);
        
        // केंद्र से ग्रह तक की लाइन
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + innerRadius * Math.cos(angle), cy + innerRadius * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();
        
        // ग्रह के नाम का बॉक्स
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(px - 40, py - 11, 80, 22);
        ctx.strokeStyle = p.color;
        ctx.strokeRect(px - 40, py - 11, 80, 22);
        
        // टेक्स्ट
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${p.label} ${deg}°`, px, py);
    });
}

function downloadPDF() {
    drawChakra();
    window.print(); // एक क्लिक में HD PDF सेव करने के लिए
}

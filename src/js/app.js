function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // डार्क बैकग्राउंड पहले सेट करें ताकि जब तक इमेज लोड हो, स्क्रीन काली न दिखे
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // ओरिजिनल PNG इमेज लोड करें
    const bgImg = new Image();
    bgImg.src = 'chakra.png'; // सुनिश्चित करें कि फाइल का नाम यही हो
    
    bgImg.onload = function() {
        // इमेज को कैनवास पर परफेक्ट फिट करें
        ctx.drawImage(bgImg, 0, 0, w, h);
        // इमेज लोड होने के बाद उसके ऊपर ग्रह और लाइन्स ड्रा करें
        drawPlanetsAndDegrees(ctx, cx, cy);
    };
    
    bgImg.onerror = function() {
        // अगर किसी वजह से इमेज लोड न हो, तो भी बैकग्राउंड और ग्रह ड्रा हो जाएं
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
    
    const innerRadius = 220; // चक्र का अंदरूनी हिस्सा जहाँ से लाइन शुरू होगी
    const outerRadius = 400; // चक्र का बाहरी हिस्सा जहाँ ग्रह का नाम दिखेगा
    
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
        
        // चक्र के अंदर से ग्रह तक की कनेक्टिंग लाइन
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + innerRadius * Math.cos(angle), cy + innerRadius * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();
        
        // ग्रह के नाम का बॉक्स
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(px - 45, py - 12, 90, 24);
        ctx.strokeStyle = p.color;
        ctx.strokeRect(px - 45, py - 12, 90, 24);
        
        // टेक्स्ट (ग्रह और डिग्री)
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${p.label} ${deg}°`, px, py);
    });
}

function downloadPDF() {
    drawChakra();
    
    const canvas = document.getElementById('astroCanvas');
    const dataUrl = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Harsh Astro Vastu Chakra Report</title>
                <style>
                    body { text-align: center; background: white; margin: 0; padding: 20px; font-family: Arial; }
                    img { max-width: 100%; height: auto; margin-top: 20px; }
                    h2 { color: #333; margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <h2>Harsh Astro Vastu Chakra Report</h2>
                <p>Generated via Astro Vastu App</p>
                <br>
                <img src="${dataUrl}" />
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

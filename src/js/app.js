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
    bgImg.src = 'chakra.png'; // सुनिश्चित करें कि आपकी इमेज का नाम यही है
    
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
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    
    const bgImg = new Image();
    bgImg.src = 'chakra.png';
    
    // इमेज पूरी तरह लोड होने के बाद ही PDF/Print विंडो खुलेगी, जिससे काला स्क्रीन नहीं आएगा
    bgImg.onload = function() {
        ctx.drawImage(bgImg, 0, 0, w, h);
        drawPlanetsAndDegrees(ctx, w/2, h/2);
        
        setTimeout(() => {
            const dataUrl = canvas.toDataURL('image/png');
            openPrintWindow(dataUrl);
        }, 300);
    };
    
    bgImg.onerror = function() {
        drawPlanetsAndDegrees(ctx, w/2, h/2);
        const dataUrl = canvas.toDataURL('image/png');
        openPrintWindow(dataUrl);
    };
}

function openPrintWindow(dataUrl) {
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
                    }, 800);
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function drawChakra() {
    const canvas = document.getElementById('astroCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // 1. डार्क प्रीमियम बैकग्राउंड (चक्र का बेस)
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // 2. कंसेंट्रिक सर्कल्स (चक्र के घेरे)
    const radii = [140, 260, 380];
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    radii.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
    });
    
    // केंद्र का डिजाइन
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // केंद्र का टेक्स्ट
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASTRO VASTU', cx, cy - 10);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('CHAKRA', cx, cy + 15);
    
    // 3. भाव (Houses I to XII) की कस्प लाइनें और नंबर
    const houses = [];
    for(let i=1; i<=12; i++) {
        houses.push(parseFloat(document.getElementById('h'+i).value) || 0);
    }
    
    const getAngle = (deg) => (deg - 90) * (Math.PI / 180);
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    for(let i=0; i<12; i++) {
        let deg = houses[i];
        let angle = getAngle(deg);
        
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx + radii[0] * Math.cos(angle), cy + radii[0] * Math.sin(angle));
        ctx.lineTo(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle));
        ctx.stroke();
        ctx.setLineDash([]);
        
        let nextDeg = houses[(i+1)%12];
        if (nextDeg <= deg) nextDeg += 360;
        let midDeg = (deg + nextDeg) / 2;
        let midAngle = getAngle(midDeg);
        
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#f43f5e';
        let labelR = (radii[0] + radii[1]) / 2;
        ctx.fillText(roman[i], cx + labelR * Math.cos(midAngle), cy + labelR * Math.sin(midAngle));
    }
    
    // 4. ग्रहों (Planets) और उनकी लाइनों को ड्रा करना
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
    
    ctx.font = 'bold 14px Arial';
    let positions = [];
    
    planets.forEach(p => {
        let deg = parseFloat(document.getElementById(p.id).value) || 0;
        let angle = getAngle(deg);
        
        let outerRadius = 410; 
        
        let overlapOffset = 0;
        positions.forEach(pos => {
            if (Math.abs(pos.angle - angle) < 0.08) {
                overlapOffset += 24; 
            }
        });
        positions.push({angle: angle});
        
        let px = cx + (outerRadius - overlapOffset) * Math.cos(angle);
        let py = cy + (outerRadius - overlapOffset) * Math.sin(angle);
        
        // कनेक्टिंग लाइन
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + radii[2] * Math.cos(angle), cy + radii[2] * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();
        
        // ग्रह का बॉक्स
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px - 45, py - 12, 90, 24);
        ctx.strokeStyle = p.color;
        ctx.strokeRect(px - 45, py - 12, 90, 24);
        
        // टेक्स्ट
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

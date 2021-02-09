const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

//handle mouse
let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;
    //console.log(mouse.x, mouse.y);
});

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width, canvas.height);

    class Particle{
        constructor(x, y, color, size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random() * 10) + 2;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        } 
        
        update(){
            ctx.fillStyle = this.color;
    
            //collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx /distance;
            let forceDirectionY = dy /distance;
    
            //max distance, past that the force will be 0
            const maxDistance = 100;
            let force =  (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;
    
            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);
    
            if (distance < mouse.radius + this.size){
                this.x -=  directionX;
                this.y -=  directionY; 
                
            } else{
                if(this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                }
                if(this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()
        }
    }
    
    
    function init() {
        particleArray = [];
        for (let y = 0, y2 = data.height; y < y2; y++){
             for(let x = 0, x2 = data.width; x < x2; x++){
                 if (data.data[(y * 4 * data.width) + (x * 4) + 3 ] > 128){
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                         data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                         data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                 }
             }
        }
    }
    
    
    
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05';
        ctx.fillRect(0,0, innerWidth, innerHeight);
        
        for(let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();
    
    window.addEventListener('resize',
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
}



    const png = new Image();
    png.src = "data:image/png;base64,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";
    window.addEventListener('load', (event) => {
        console.log('page has loaded');
        ctx.drawImage(png, 0, 0);
        drawImage();
    });
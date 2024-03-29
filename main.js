 // Variables para la escena, cámara y renderizador
 let scene, camera, renderer;
 let cubes = [];
 let gridWidth = 20; // Ancho de la cuadrícula
 let gridSize = 20; // Tamaño de la cuadrícula
 let spacing = 2; // Espacio entre cubos
 let interval = 800; // Intervalo entre iteraciones en milisegundos
 let grid = []; // Matriz para el estado del juego de la vida
 let cycles = 0; // Contador de ciclos
 
 // Inicialización de la escena
 function init() {
     // Creación de la escena
     scene = new THREE.Scene();
 
     // Configuración de la cámara
     const aspectRatio = window.innerWidth / window.innerHeight;
     const width = 80; // Ancho de la vista de la cámara
     const height = width / aspectRatio;
     camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
     camera.position.set(0, 0, 20); // Ajuste de la posición de la cámara
     camera.lookAt(0, 0, 0); // La cámara mira hacia el centro de la escena
 
     // Configuración del renderizador
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.setClearColor(0xCCCCCC); // Fondo gris
     document.body.appendChild(renderer.domElement);
 
     // Creación de la cuadrícula de cubos
     createGridOfCubes();
 
     // Renderizar la escena inicialmente
     render();
 }
 
 // Función para crear la cuadrícula de cubos
 function createGridOfCubes() {
     for (let i = 0; i < gridWidth; i++) {
         grid[i] = [];
         for (let j = 0; j < gridWidth; j++) {
             const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); // Geometría del cubo
             const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Material del cubo, rojo
             const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); // Creación del cubo
             cube.position.set(i * spacing - (spacing * (gridWidth - 1)) / 2, j * spacing - (spacing * (gridWidth - 1)) / 2, 0); // Posición del cubo
             scene.add(cube); // Añadir cubo a la escena
             cubes.push(cube); // Añadir cubo al array de cubos
             grid[i][j] = Math.random() < 0.5 ? 0 : 1; // Inicializar el estado del juego de la vida
         }
     }
 }
 
 // Función para aplicar una iteración del juego de la vida
 function updateGameOfLife() {
     let newGrid = [];
     for (let i = 0; i < gridWidth; i++) {
         newGrid[i] = [];
         for (let j = 0; j < gridWidth; j++) {
             let neighbors = countNeighbors(i, j);
             if (grid[i][j] === 1) {
                 if (neighbors < 2 || neighbors > 3) {
                     newGrid[i][j] = 0; // Célula muere por baja población o sobrepoblación
                 } else {
                     newGrid[i][j] = 1; // Célula sobrevive
                 }
             } else {
                 if (neighbors === 3) {
                     newGrid[i][j] = 1; // Célula muerta se convierte en viva por reproducción
                 } else {
                     newGrid[i][j] = 0; // Célula muerta permanece muerta
                 }
             }
         }
     }
     grid = newGrid; // Actualizar el estado del juego de la vida
     updateCubeColors(); // Actualizar colores de los cubos según el estado del juego de la vida
 
     // Incrementar el intervalo a partir del segundo ciclo
     if (cycles > 0) {
         interval += 100; // Incremento de 100 ms en el intervalo
     }
     cycles++; // Incrementar el contador de ciclos
 }
 
 // Función para contar el número de vecinos vivos de una celda en la cuadrícula
 function countNeighbors(x, y) {
     let count = 0;
     for (let i = -1; i <= 1; i++) {
         for (let j = -1; j <= 1; j++) {
             let neighborX = x + i;
             let neighborY = y + j;
             if (neighborX >= 0 && neighborX < gridWidth && neighborY >= 0 && neighborY < gridWidth) {
                 count += grid[neighborX][neighborY];
             }
         }
     }
     count -= grid[x][y]; // Restar el estado de la celda en sí misma
     return count;
 }
 
 // Función para actualizar los colores de los cubos según el estado del juego de la vida
 function updateCubeColors() {
     cubes.forEach((cube, index) => {
         let x = Math.floor(index / gridWidth);
         let y = index % gridWidth;
         cube.material.color.setHex(grid[x][y] === 1 ? 0xff0000 : 0x000000); // Rojo para célula viva, negro para célula muerta
     });
 }
 
 // Función de renderizado
 function render() {
     requestAnimationFrame(render);
     setTimeout(() => {
         updateGameOfLife(); // Actualizar el estado del juego de la vida
         renderer.render(scene, camera);
     }, interval);
 }
 
 // Llamar a la función de inicialización
 init();
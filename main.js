!(function(win, doc) {
  if (!Detector.webgl) Detector.addGetWebGLMessage();
  var scene, camera, renderer, cube;
  var size = 500, step = 25;
  var pos;
  var raf;
  var snake = null;
  var toRender = 0;
  
  var gameScoreBoard = doc.getElementById('gamescore');

  var obstacles = []; // Array of obstacles
  
  var keys = {
    38: 'backward', // up key
    40: 'forward', // down key
    39: 'right', // -> key
    37: 'left', // <- key
    87: 'up', // W key
    83: 'down', // S key
    32: 'stop' // spacebar
  }

  var keyActions = {
    'backward': {
      enabled: true,
      action: function() {
        snake.back();
      }
    },
    'forward': {
      enabled: true,
      action: function() {
        snake.forward();
      }
    },
    'right': {
      enabled: true,
      action: function() {
        snake.right();
      }
    },
    'left': {
      enabled: true,
      action: function(){ 
        snake.left();
      }
    },
    'up': {
      enabled: true,
      action: function() {
        snake.up();
      }
    },
    'down': {
      enabled: true,
      action: function() {
        snake.down();   
      }
    },
    'stop': {
      enabled: true,
      action: function() {
        snake.clear();  
      }
    }
  };

  // Game Levels
  var levels = {
    1: {
      speed: 20
    },
    2: {
      speed: 15
    },
    3: {
      speed: 10
    },
    4: {
      speed: 5
    },
    5: {
      speed: 2
    }
  }

  
  var interval = 10000;
  function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, win.innerWidth / win.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    //camera.position.z = 500;
    camera.lookAt(new THREE.Vector3());

    // grid

    var geometry = new THREE.Geometry(); 
    for ( var i = - size; i <= size; i += step ) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));
      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    scene.add(line);

    // Snake
    snake = new Snake(scene, step, 0xff0000);
    snake.render();

    addBallToScene(300, step / 2, 105);
    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(win.innerWidth - 10, win.innerHeight - 10);
    renderer.setClearColor(0xf0f0f0); //0xf0f0f0
    doc.body.appendChild(renderer.domElement);

    //var ambientLight = new THREE.AmbientLight( 0xcccccc );
    //scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 800, 1300).normalize();
    scene.add(directionalLight);
  }

  function triggerRenders() {
    if (toRender == 7) {
      snake.render();
      render();
      toRender = 0;
    }
    toRender++;
    raf = win.requestAnimationFrame(triggerRenders);
  }

  function addBallToScene(x, y, z) {
    var geometry = new THREE.SphereGeometry(step/2, step/2, step/2);
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
    snake.setCurrentTagPosition({x: x, y: y, z: z});
    return sphere;
  }
  
  function setScore() {
    gameScoreBoard.innerHTML = Number(gameScoreBoard.innerText) + 2;
  }
  
  function clearScore() {
    gameScoreBoard.innerHTML = '0';
  }

  function generateRandomCoordinates() {
    return {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      z: Math.floor(Math.random() * size)
    }
  }

  function onKeyPressUp(e) {
    console.log(e.keyCode);
    var keyAction = keyActions[keys[e.keyCode]];
    if (keyAction && keyAction.enabled) {
      keyAction.action();
      if (raf) {
        win.cancelAnimationFrame(raf);
      }
      raf = win.requestAnimationFrame(triggerRenders);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  init();
  render();
  document.addEventListener('keyup', onKeyPressUp, false);
})(window, document);

!(function(win, doc) {
  if (!Detector.webgl) Detector.addGetWebGLMessage();
  var scene, camera, renderer, cube;
  var gridSize = 750, unitSize = 50;
  var pos;
  var raf;
  var snake = null;
  var toRender = 0;
  var tag = null;
  
  var gameScoreBoard = doc.getElementById('gamescore');
  var pauseScreen = doc.getElementById('pause');
  
  function showPauseScreen() {
    pauseScreen.className = 'paused';
  }
  
  function hidePauseScreen() {
    pauseScreen.className = 'paused hidden';
  }

  var obstacles = []; // Array of obstacles
  
  var keys = {
    38: 'backward', // up key
    40: 'forward', // down key
    39: 'right', // -> key
    37: 'left', // <- key
    87: 'up', // W key
    83: 'down', // S key
    32: 'pause' // spacebar
  }

  var keyActions = {
    'backward': {
      enabled: true,
      action: function() {
        snake.back();
        keyActions.forward.enabled = false;
        keyActions.left.enabled = true;
        keyActions.right.enabled = true;
        keyActions.pause.enabled = true;
        hidePauseScreen();
      }
    },
    'forward': {
      enabled: true,
      action: function() {
        snake.forward();
        keyActions.backward.enabled = false;
        keyActions.left.enabled = true;
        keyActions.right.enabled = true;
        keyActions.pause.enabled = true;
        hidePauseScreen();
      }
    },
    'right': {
      enabled: true,
      action: function() {
        snake.right();
        keyActions.left.enabled = false;
        keyActions.forward.enabled = true;
        keyActions.backward.enabled = true;
        keyActions.pause.enabled = true;
        hidePauseScreen();
      }
    },
    'left': {
      enabled: true,
      action: function(){ 
        snake.left();
        keyActions.right.enabled = false;
        keyActions.backward.enabled = true;
        keyActions.forward.enabled = true;
        keyActions.pause.enabled = true;
        hidePauseScreen();
      }
    },
    /*'up': {
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
    },*/
    'pause': {
      enabled: false,
      action: function() {
        snake.clear();
        keyActions.pause.enabled = false;
        showPauseScreen();
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
    // --- Scene ---
    scene = new THREE.Scene();

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(65, win.innerWidth / win.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    //camera.position.z = 500;
    camera.lookAt(new THREE.Vector3());

    // --- Grid ---
    var gridGeometry = new THREE.Geometry(); 
    for ( var i = -gridSize; i <= gridSize; i += unitSize ) {
      gridGeometry.vertices.push(new THREE.Vector3(-gridSize, 0, i));
      gridGeometry.vertices.push(new THREE.Vector3(gridSize, 0, i));
      gridGeometry.vertices.push(new THREE.Vector3(i, 0, -gridSize));
      gridGeometry.vertices.push(new THREE.Vector3(i, 0, gridSize));
    }
    var gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });
    var line = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces );
    scene.add(line);

    // --- Snake ---
    snake = new Snake(scene, unitSize, 0xff0000);
    snake.render();
    snake.onTagCollision = function() {
      scene.remove(tag);
      tag = addTagToScene(randomAxis(), unitSize / 2, randomAxis());
      setScore();
    };
    snake.onSelfCollision = function() {
      snake.reset();
    };

    tag = addTagToScene(randomAxis(), unitSize / 2, randomAxis());
    
    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(win.innerWidth - 10, win.innerHeight - 10);
    renderer.setClearColor(0xf0f0f0);
    
    doc.body.appendChild(renderer.domElement);

    //var ambientLight = new THREE.AmbientLight( 0xcccccc );
    //scene.add(ambientLight);
    
    
    // --- Directional Lighting ---
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 800, 1300).normalize();
    scene.add(directionalLight);
  }
  
  function randomAxis() {
    var point = randomPoint();
    return point > gridSize ? (gridSize - point) - 25 : point - 25;
  }

  function triggerRenders() {
    if (toRender == 10) {
      snake.render();
      render();
      toRender = 0;
    }
    toRender++;
    raf = win.requestAnimationFrame(triggerRenders);
  }

  function addTagToScene(x, y, z) {
    var geometry = new THREE.BoxGeometry(unitSize, unitSize, unitSize);
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
    snake.setCurrentTagPosition({ x: x, y: y, z: z });
    return sphere;
  }
  
  function setScore() {
    gameScoreBoard.innerHTML = Number(gameScoreBoard.innerText) + 1;
  }
  
  function clearScore() {
    gameScoreBoard.innerHTML = '0';
  }

  function randomPoint() {
    // Generate random points between 0 and the gridSize
    // in steps for unitSize i.e 0, 50, 350, 700, 40 etc
    var pos = Math.floor(Math.random() * gridSize * 2);
    return pos - (pos % unitSize);
  }

  function onKeyPressUp(e) {
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

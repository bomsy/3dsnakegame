!(function(win, doc) {
  if (!Detector.webgl) Detector.addGetWebGLMessage();
  var scene, camera, renderer, cube;
  var size = 500, step = 25;
  var pos;
  var raf;
  var snake = null;
  var toRender = 0;

  var obstacles = []; // Array of obstacles

  var keyActions = {
    // UP Key - For 3d backward movement
    38: {
      enabled: true,
      action: function() {
        snake.back();
      }
    },
    // DOWN Key - For 3d forward movement
    40: {
      enabled: true,
      action: function() {
        snake.forward();
      }
    },
    // RIGHT Key - For 3d right movement
    39: {
      enabled: true,
      action: function() {
        snake.right();
      }
    },
    // LEFT Key - For 3d left movement
    37: {
      enabled: true,
      action: function(){ 
        snake.left();
      }
    },
    // W Key - For 3d up movement
    87: {
      enabled: true,
      action: function() {
        snake.up();
      }
    },
    // S Key - For 3d down movement
    83: {
      enabled: true,
      action: function() {
        snake.down();   
      }
    },
    32: {
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

  //snake
  function Snake(scene, size, color) {
    this.snake = [];
    this.scene = scene;
    this.size = size; // snake is made up of cubes
    this.color = color;
    this.distance = 25; // distance to move by
    
    this.direction = null;
    this.axis = null;

    this.onCollision
    
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    this.material = new THREE.MeshLambertMaterial( { color: this.color } );
    this.init();
  };

  Snake.prototype = {
    init: function() {
      this.addCube();
      this.addCube();
      this.addCube();
      this.addCube();
      this.addCube();
      this.addCube();
      this.setDefaultPositions();
    },
    setDefaultPositions: function() {
      var self = this;
      this.snake.forEach(function(cube, index) {
        cube.position.z = -1 * (self.size * (index + 1));
        cube.position.y = self.size / 2;
      });                   
    },
    createCube: function(position) {
      var cube = new THREE.Mesh(this.geometry, this.material);
      return cube;
    },
    addCube: function() {
      this.snake.push(this.createCube());
    },
    render: function() {
      var self = this;
      var next = null;
      this.snake.forEach(function(cube) {
        var temp = null;
        if (self.axis !== null && self.direction !== null) {
          if (!next) {
            next = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
            cube.position[self.axis] += (self.direction * self.distance);

            console.log('-- position (Cube Head) --');
            console.log('x:' + cube.position.x);
            console.log('y:' + cube.position.y);
            console.log('z:' + cube.position.z);

          } else {
            temp = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
            cube.position.set(next.x, next.y, next.z);
            next = { x: temp.x, y: temp.y, z: temp.z };
          }
        }
        self.renderCube(cube);
      });
    },
    back: function() {
      this.axis = 'z';
      this.direction = -1;
    },
    forward: function() {
      this.axis = 'z';
      this.direction = 1;
    },
    up: function() {
      this.axis = 'y';
      this.direction = 1;
    },
    down: function() {
      this.axis = 'y';
      this.direction = -1;
    },
    right: function() {
       this.axis = 'x';
       this.direction = 1;
    },
    left: function() {
      this.axis = 'x';
      this.direction = -1;
    },
    clear: function() {
      this.axis = null;
      this.direction = null;
    },
    renderCube: function(cube) {
      this.scene.add(cube)
    }
  };

  var interval = 10000;
  function init() {
    //scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(55, win.innerWidth / win.innerHeight, 1, 10000);
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

    addBallToScene(50, 100, 45);
    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(win.innerWidth - 10, win.innerHeight - 10);
    renderer.setClearColor(0xf0f0f0); //0xf0f0f0
    doc.body.appendChild(renderer.domElement);

    //var ambientLight = new THREE.AmbientLight( 0x606060 );
    //scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 800, 1300).normalize();
    scene.add(directionalLight);
  }

  function triggerRenders() {
    if (toRender == 5) {
      snake.render();
      render();
      toRender = 0;
    }
    toRender++;
    raf = win.requestAnimationFrame(triggerRenders);
  }

  function addBallToScene(x, y, z) {
    var geometry = new THREE.SphereGeometry(17, 17, 17);
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.y = step / 2;
    console.log('-- position (Ball) --');
    console.log('x:' + sphere.position.x);
    console.log('y:' + sphere.position.y);
    console.log('z:' + sphere.position.z);
    scene.add(sphere);
    return sphere;
  }

  function hasCollide() {
  
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
    if (keyActions[e.keyCode] && keyActions[e.keyCode].enabled) {
      keyActions[e.keyCode].action();
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

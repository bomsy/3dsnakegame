!(function(win, doc) {
  if (!Detector.webgl) Detector.addGetWebGLMessage();
  var scene, camera, renderer, cube, cube2;
  var snake = [];
  var size = 500, step = 50;
  var pos;
  var raf;
  var positions = {
    // UP Key - For 3d backward movement
    38: {
      direction: 'z',
      step: -1
    },
    // DOWN Key - For 3d forward movement
    40: {
      direction: 'z',
      step: 1,
    },
    // RIGHT Key - For 3d right movement
    39: {
      direction: 'x',
      step: 1
    },
    // LEFT Key - For 3d left movement
    37: {
      direction: 'x',
      step: -1
    },
    // W Key - For 3d up movement
    87: {
      direction: 'y',
      step: 1
    },
    // S Key - For 3d down movement
    83: {
      direction: 'y',
      step: -1
    }
  };

  var Snake = function() {
    this.snake = [];  
  };

  Snake.prototype.move = function() {
  
  };

  var interval = 10000;
  function init() {
    //scene
    scene = new THREE.Scene();
    //camera
    camera = new THREE.PerspectiveCamera(45, win.innerWidth / win.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt(new THREE.Vector3());

    // grid

    var geometry = new THREE.Geometry();
    
    for ( var i = - size; i <= size; i += step ) {
      geometry.vertices.push(new THREE.Vector3(-size, 0, i));
      geometry.vertices.push(new THREE.Vector3(size, 0, i));
      geometry.vertices.push(new THREE.Vector3(i, 0, -size));
      geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }

    var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0.2, transparent: true } );
    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    scene.add( line );

    var geometry = new THREE.CubeGeometry(step, step, step);
    var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    cube = new THREE.Mesh( geometry, material );

    scene.add(cube);

    //setBallPosition();
    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(win.innerWidth - 10, win.innerHeight - 10);
    renderer.setClearColor(0x000000); //0xf0f0f0
    doc.body.appendChild(renderer.domElement);

    //var ambientLight = new THREE.AmbientLight( 0x606060 );
    //scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(45, 45, 45).normalize();
    scene.add( directionalLight );
  }

  function move() {
    cube.position[pos.direction] += (pos.step * 5);
    render();
    console.log(randomCoords());
    raf = win.requestAnimationFrame(move);
  }

  function setBallPosition() {
    var geometry = new THREE.SphereGeometry( step, step, step );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
  }

  function randomCoords() {
    return {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      z: Math.floor(Math.random() * size)
    }
  }

  function onKeyPressUp(e) {
    console.log(e.keyCode);
    if (e.keyCode === 32) {
      if (raf) {
        win.cancelAnimationFrame(raf);
      }
      return;
    }
    if (positions[e.keyCode]) {
      pos = positions[e.keyCode];
      if (raf) {
        win.cancelAnimationFrame(raf);
      }
      raf = win.requestAnimationFrame(move);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  init();
  render();
  document.addEventListener('keyup', onKeyPressUp, false);
})(window, document);

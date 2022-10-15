//"Hamburger menu"
var navlabel = document.querySelector(".nav-toggle-label");

function NavCross()
{  
    navlabel.classList.toggle("nav-cross");
}

//Scroll Animations
var about = document.getElementById("about");
var portfolio = document.getElementById("portfolio");
var contact = document.getElementById("contact");

var options = {
    root: null,
    threshold: 0.5,
    rootMargin: "10px"
};
var observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
        {
            return;
        }
        if (entry.target.className == "about")
        {
            Highlight("t1");
        }
        else if (entry.target.className == "portfolio")
        {
            Highlight("t2");
        }
        else if (entry.target.className == "contact")
        {
            Highlight("t3");
        }
    });
}, options);

observer.observe(about);
observer.observe(portfolio);
observer.observe(contact);


//Navbar colors
var id = null;
var titles = document.getElementsByClassName("t");

function Highlight(id) {

    var navbar = document.getElementById("nav-toggle");
    navbar.checked = false;
    for (i = 0; i < titles.length; i++)
    {
        titles[i].style.color = "white";
    }
    StyleHeader(id);
    if (navlabel.classList.contains("nav-cross"))
    {
        NavCross();
    }
}

function StyleHeader(id)
{
    var high = document.getElementById(id);
    var cyan = document.getElementById("navcyan");
    var magenta = document.getElementById("navmagenta");
    var yellow = document.getElementById("navyellow");

    var up = .1;
    var down = 1;
    var t = 10;

    if (id == "t1")
    {
        high.style.color = "rgba(163, 199, 231, 1)";

        clearInterval(id);
        id = setInterval(Fade, t);
        function Fade()
        {
            if (up >= 1)
            {
                clearInterval(id);
            }
            else
            {
                up += .05;
                down -= .05;
                cyan.style.opacity = up;
                magenta.style.opacity = down;
                yellow.style.opacity = down;
            }
        }
    }
    else if (id == "t2")
    {
        high.style.color = "rgba(239, 188, 206, 1)";

        clearInterval(id);
        id = setInterval(Fade, t);
        function Fade()
        {
            if (up >= 1)
            {
                clearInterval(id);
            }
            else
            {
                up += .05;
                down -= .05;
                cyan.style.opacity = down;
                magenta.style.opacity = up;
                yellow.style.opacity = down;
            }
        }
    }
    else if (id == "t3")
    {
        high.style.color = "rgba(232, 196, 130, 1)";

        clearInterval(id);
        id = setInterval(Fade, t);
        function Fade()
        {
            if (up >= 1)
            {
                clearInterval(id);
            }
            else
            {
                up += .05;
                down -= .05;
                cyan.style.opacity = down;
                magenta.style.opacity = down;
                yellow.style.opacity = up;
            }
        }
    }
}

//Game slides
var gamesLeft = document.getElementById("arrow-left-games")
var gamesRight = document.getElementById("arrow-right-games")

var dotsContainer = document.getElementById("dots")
var dots = []
var gamesConatiner = document.getElementById("games")
var games = []
for(var i=0; i < gamesConatiner.children.length; i++) {
    var game = gamesConatiner.children[i]
    games.push(game)
    var dot = document.createElement("span")
    dot.innerHTML = "·"
    dotsContainer.append(dot)
    dots.push(dot)
}


for(var i=0; i < dotsContainer.children.length; i++) {
    var dot = dotsContainer.children[i]
    dots.push(dot)
}

var slidin = false
var index = 0
InitGames()

gamesRight.addEventListener("pointerup", () => {
    if (slidin) return
    slidin = true
    index++
    if (index > games.length - 1)
        index = games.length - 1
    else
        GameTransitions(games[index])
})
gamesLeft.addEventListener("pointerup", () => {
    if (slidin) return
    slidin = true
    index--
    if (index < 0)
        index = 0
    else
        GameTransitions(games[index])
})

function InitGames() {
    games.forEach((game) => {
        game.style.zIndex = -1
        game.style.transform = ""
        game.style.transform += "perspective(900px)"  
        game.style.transform += "rotateX(60deg)"
        game.style.transform += "scale(0.7)"
        game.style.transform += "translate(-50%, -50%)"
    })
    dots.forEach((dot) => {
        dot.style.opacity = .3
    })
    games[0].style.zIndex = 1
    games[0].style.transform = ""
    games[0].style.transform += "rotate(0deg)"
    games[0].style.transform += "scale(1)"
    games[0].style.transform += "translate(-50%, -50%)"
    dots[0].style.opacity = 1
}

async function GameTransitions(el) {
    games.forEach((game) => {
        if (game != el) {
            //game.style.zIndex = -1
            game.style.transform = ""
            game.style.transform += "perspective(900px)"  
            game.style.transform += "rotateX(50deg)"
            game.style.transform += "scale(0.7)"
            game.style.transform += "translate(-50%, -50%)"
        }
    })

    dots.forEach((dot) => {
        if (dots[index] != dot)
            dot.style.opacity = .3
    })
    dots[index].style.opacity = 1

    await delay(500)
    games.forEach((game) => {
        if (game != el) {
            game.style.zIndex = -1
        }
    })
    el.style.zIndex = 1

    await delay(500)
    el.style.transform = ""
    el.style.transform += "rotate(0deg)"
    el.style.transform += "scale(1)"
    el.style.transform += "translate(-50%, -50%)"
    slidin = false
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

//BABYLON JS
var canvas = document.getElementById("renderCanvas")
var engine = new BABYLON.Engine(canvas, true)

var scene = createScene()

function createScene () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 3, 40, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);
    
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.7;

    var boxx = []
    var poss = []
        poss.push(new BABYLON.Vector3(-9, 0, 9))
    poss.push(new BABYLON.Vector3(-6, 0, 6))
    poss.push(new BABYLON.Vector3(-3, 0, 3))
    poss.push(new BABYLON.Vector3(3, 0, -3))
    poss.push(new BABYLON.Vector3(6, 0, -6))
    poss.push(new BABYLON.Vector3(9, 0, -9))
    
    for (var i=0; i < 6; i++) {
        var boxlet = BABYLON.MeshBuilder.CreateSphere("box", {diameter:4}, scene)
        boxx.push(boxlet)
        boxlet.position = poss[i]
    }
    
    var actionManager = new BABYLON.ActionManager(scene)
    boxx.forEach((box) => {
        box.actionManager = actionManager
        box.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger : BABYLON.ActionManager.OnPickTrigger
        }))
    })


    
    return scene
}

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

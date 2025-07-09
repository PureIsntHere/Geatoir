//Dynamic random site title
window.addEventListener("load", () => {
    const titles = ["Down the rabbithole, Alice", "Lets take a trip","Did you see that?", "hi.. Im Pure.", "Something creative here...","Hello world!","I can see you too!","Yes, its a dmc reference","Beware the jabberwock"]
    var item = titles[Math.floor(Math.random()*titles.length)];
    document.title = item;
    console.log("Page Loaded.")
});

//link handlers since using href links breaks animations
function OpenTwitch(){
    window.open("https://www.twitch.tv/pureisnthere")
}

function OpenTwitter(){
    window.open("https://twitter.com/PureIsntHere")
}

function OpenMail(){
    window.open("mailto:PureWasHere@protonmail.com")
}

function OpenGithub(){
    window.open("https://github.com/PureIsntHere") 
}

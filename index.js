var lastScrollTop
let elements = []

var curElementIndex = 0
var doneScrolling = true
var currentTransform = 0
var stillScrolling = false


var title = elements[0]["title"]
var titleFont = elements[0]["font"]
var titleIndex = 0
var titleOld = ""
var titleDel = false
function typeTitle() {
    if (titleOld != title) {
        if (titleIndex < title.length && !titleDel) {
            var chr = title.charAt(titleIndex)

            document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + chr;
            titleOld += chr;
            titleIndex++;
        } else if (titleIndex > title.length || titleDel) {
            if (titleIndex == 0 || document.getElementById("title").innerHTML == "") {
                titleDel = false

                titleOld = ""
                document.getElementById("title").innerHTML = ""
                titleIndex = 0

                document.getElementById("title").style.fontFamily = titleFont
            } else {
                titleDel = true
            }

            document.getElementById("title").innerHTML = document.getElementById("title").innerHTML.slice(0, -1);
            titleOld = titleOld.slice(0, -1)
            titleIndex--;
        }
    }
}

var paragraph = elements[0]["description"]
var paragraphIndex=0
var paragraphOld = ""
var paragraphDel = false
var pchr = ""

var pBlinkTop = -24;
var pBlinkLeft = 50;
var ptext = document.createElement('p')
var pelem = document.getElementById("paragraph")
var ptype = ""

var disableBlink = false

var blink = document.createElement('p')
blink.className = "blink"
blink.innerHTML = "|"

function typeParagraph() {
    if (pelem == null || pelem == undefined) {
        pelem = document.getElementById("paragraph")
    }
    if (paragraphOld != paragraph) {
        if (paragraphIndex < paragraph.length && !paragraphDel) {
            if (paragraph.charAt(paragraphIndex) == "\n") {
                var pchr = ""

                var z = document.createElement('p')
                document.getElementById("paragraphbox").appendChild(z)
                ptype = ""
                pelem = z

            } else {

                if (paragraph.charAt(paragraphIndex) == "{" && paragraph.charAt(paragraphIndex+2) == "}") {
                    var pchr = elements[curElementIndex]["html"][parseInt(paragraph.charAt(paragraphIndex+1))]
                    disableBlink = true

                    paragraphIndex += 2
                } else {
                    var pchr = paragraph.charAt(paragraphIndex)
                    disableBlink = false
                }
            }
            
            pelem.innerHTML = ptype + pchr;

            if (pchr != "" && !disableBlink) {
                pelem.appendChild(blink)
            }
            
            paragraphOld += pchr;
            ptype += pchr;

            paragraphIndex++;

        } else if (paragraphIndex > paragraph.length || paragraphDel) {
            ptype = ""
            if (pelem.innerHTML.length == 0) {
                
                pelem.innerHTML = ""

                var paragraphs = document.getElementById("paragraphbox").childNodes
                for(var i = 0; i < paragraphs.length; i++){
                    paragraphs[i].innerHTML = "";
                }

                paragraphOld = ""
                paragraphIndex = 0

                paragraphDel = false
            } else {
                paragraphDel = true
            }

            pelem.innerHTML = ptype;
            paragraphOld = paragraphOld.slice(0, -3)
            paragraphIndex--;
        }
    }
}

function handleWheel(event) {
    if (!doneScrolling) {
        return
    }
    // Access scroll information from the event
    var delta = Math.floor(((event.deltaY || event.detail || event.wheelDelta)*-1) / 18);

    // Do something with the scroll information

    var isDown = false
    var didIActuallyMove = false

    doneScrolling = false

    if (delta > 0) {
        if (curElementIndex != 0) {
            curElementIndex -= 1
        }
        isDown = false
    } else {
        if (curElementIndex != elements.length-1) {
            curElementIndex += 1
        }
        isDown = true
    }

    
    if (!isDown) {
        if (0 != currentTransform) {
            currentTransform += 100
            didIActuallyMove = true
        }
        document.getElementById("fullimgs").style.transform = `translateY(${currentTransform}vh)`
    } else {
        if (currentTransform != (100 * (elements.length-1))*-1) {
            currentTransform -= 100
            didIActuallyMove = true
        }
        document.getElementById("fullimgs").style.transform = `translateY(${currentTransform}vh)`
    }

    if (didIActuallyMove) {
        titleDel = true
        titleOld = ""
        title = elements[curElementIndex]["title"]
        titleFont = elements[curElementIndex]["font"]

        paragraphDel = true
        ptype = ""
        paragraph = elements[curElementIndex]["description"]
    }
    didIActuallyMove = false
}

var oldScroll = doneScrolling
function checkIfStoppedScrolling() {

    if (!oldScroll) { // if it wasn't done scrolling before                
        if (!oldScroll == doneScrolling) { // if it's still not done scrolling
            // don't mess w it
            doneScrolling = false
        } else { // is done scrolling
            doneScrolling = true
        }
    }
    oldScroll = doneScrolling
}

document.addEventListener("DOMContentLoaded", function() {
    for (var i=0; i<elements.length; i++) {
        var itm = elements[i]

        if ("image" in itm) {
            var img = document.createElement("img")
            img.src = itm["image"]
            document.getElementById("fullimgs").appendChild(img)
        } else {
            var div = document.createElement("div")
            div.style.width = "100vw"
            div.style.height = "100vh"
            div.style.backgroundColor = itm["color"]
            document.getElementById("fullimgs").appendChild(div)
        }

    }

    document.addEventListener('wheel', handleWheel)
})

var xhr = new XMLHttpRequest()
xhr.open("GET", "/info.json", true)
xhr.onload = function() {
    elements = JSON.parse(xhr.responseText)
    console.log("loaded")

    setInterval(checkIfStoppedScrolling, 250)
    setInterval(typeTitle, 150)
    setInterval(typeParagraph, 25)
}
xhr.send()
/*global document, console, window, move, elementinfo*/
// Move.JS https://github.com/visionmedia/move.js

var screenheight = 0;
var screenwidth = 0;
var animatetime = '5s';
var infopageactivated = false;
var hviewactivated = false;

var scalefinish = false;

var smallsite = false;
var mobilesite = false;

var EleNum;
var TimerMove;

var CurrentHElement = 1;

function periodictable(animatetime, type) {
    if (type === 1) { //Horizontal
        horizontalchange(1, true);
        move(document.getElementById('eledes')) // Bottom Panel
            .setProperty('height', '25vh')
            .setProperty('opacity', '1')
            .duration('2s')
            .ease('in-out')
            .end();
    } else {
        if (hviewactivated === true) { // Deactivate Bottom Panel
            move(document.getElementById('eledes'))
                .setProperty('height', '0px')
                .setProperty('opacity', '0')
                .duration('2s')
                .ease('in-out')
                .end();
            hviewactivated = false;
        }
    }

    var elements = document.querySelectorAll(".element");

    for (var i = 0; i < elements.length; i++) {

        window.clearInterval(TimerMove);

        if (type == 0) { //Random - Random X,Y,Z Values
            // For Future, Move in One Direction Only
            var locx = (Math.floor(Math.random() * screenwidth - screenwidth / 2));
            var locy = (Math.floor(Math.random() * screenheight - screenheight / 2));
            var locz = (Math.floor(Math.random() * screenheight * 2 - screenheight / 2 * 2));

            move(elements[i])
                .setVendorProperty('transform', 'translate3d(' + locx + 'px,' + locy + 'px,' + locz + 'px)')
                .duration(animatetime)
                .ease('in-out')
                .end();

            TimerMove = setInterval(function () { //Activate 5s Timer
                periodictable("5s", 0);
            }, 5000);
        } else if (type == 0.5) { //Init Form - Elements Fly In
            var locx = (Math.floor(Math.random() * 9999 - 9999 / 2));
            var locy = (Math.floor(Math.random() * 9999 - 9999 / 2));
            var locz = (Math.floor(Math.random() * 9999 * 2 - 9999 / 2 * 2));

            move(elements[i])
                .setVendorProperty('transform', 'translate3d(' + locx + 'px,' + locy + 'px,' + locz + 'px)')
                .duration(animatetime)
                .ease('snap')
                .end();
        } else if (type == 2) { //Table
            var elelocation = (i + 1) * 17; //32.5 + 560
            var locx = -(35 + 60 * 9) + (elementinfo[elelocation - 14]) * 60
            var locy = -(10 + 5 * 70) + (elementinfo[elelocation - 13]) * 70

            if (i >= 56 && i < 71) {
                locy = -(10 + 5 * 70) + 8.3 * 70
                locx = -(35 + 60 * 9) + (i - 52) * 60
            }
            if (i >= 88 && i < 103) {
                locx = -(35 + 60 * 9) + (i - 84) * 60
                locy = -(10 + 5 * 70) + 9.3 * 70
            }

            move(elements[i])
                .setVendorProperty('transform', 'translate3d(' + locx + 'px,' + locy + 'px,' + '0)')
                .duration(animatetime)
                .ease('in-out')
                .end();
        }
    }
}

function elementpage(elementnum) { //Info Page
    if (hviewactivated == true) {
        if (elementnum != CurrentHElement) {
            horizontalchange(elementnum, true);
            return false;
        }
    }
    if ((smallsite == true) || (mobilesite == true)) {
        document.getElementById('infocontainer').style.opacity = 0;
        if (scalefinish == true) {
            window.scrollTo(0, document.getElementById('infocontainer').offsetTop);
        }
        move(document.getElementById('infocontainer'))
            .ease('in-out')
            .duration('.3s')
            .set('opacity', '1')
            .end();
    } else //Activate/Show Info Page
    {
        move(document.getElementById('infocontainer'))
            .set('margin-left', '0px')
            .duration('.5s')
            .ease('in-out')
            .end();

        move(document.getElementById('ptablecontainer'))
            .set('opacity', '0')
            .duration('.5s')
            .ease('in-out')
            .end();
    }


    infopageactivated = true;
    var elelocation = elementnum * 17;
    document.getElementById('elementsym').innerHTML = elementinfo[elelocation - 17];
    document.getElementById('symbol').innerHTML = "Symbol: " + elementinfo[elelocation - 17];
    document.getElementById('elename').innerHTML = "Name: " + elementinfo[elelocation - 16];
    document.getElementById('elenumber').innerHTML = "Atomic Number: " + elementinfo[elelocation - 15];
    EleNum = elementinfo[elelocation - 15];
    document.getElementById('elemass').innerHTML = "Mass: " + elementinfo[elelocation - 12];
    document.getElementById('eleclassification').innerHTML = "Classification: " + elementinfo[elelocation - 11];
    document.getElementById('elelocation').innerHTML = "Location: " + "Group " + elementinfo[elelocation - 14] + ", Period " + elementinfo[elelocation - 13] + ", " + elementinfo[elelocation - 10];

    if (elementinfo[elelocation - 14] === undefined) {
        document.getElementById('elelocation').innerHTML = "Location: " + "Group " + "None" + ", Period " + elementinfo[elelocation - 13] + ", " + elementinfo[elelocation - 10];
    }
    if (elementinfo[elelocation - 12] === undefined) {
        document.getElementById('elemass').innerHTML = "Mass: ";
    }

    document.getElementById('eleshellconfig').innerHTML = "Electron Shell Configuration: " + elementinfo[elelocation - 9];
    document.getElementById('elesubshellconfig').innerHTML = "Electron subshell configuration: " + elementinfo[elelocation - 8];
    document.getElementById('eleionisation').innerHTML = "Ionisation energy: " + elementinfo[elelocation - 7];
    document.getElementById('elestate').innerHTML = "State at Room Temperature: " + elementinfo[elelocation - 6];
    document.getElementById('eleboiling').innerHTML = "Boiling Point: " + elementinfo[elelocation - 5];
    document.getElementById('elemelting').innerHTML = "Melting Point: " + elementinfo[elelocation - 4];
    document.getElementById('eleisotopes').innerHTML = "Isotopes: " + elementinfo[elelocation - 3];
    document.getElementById('elediscovery').innerHTML = "Discovered: " + elementinfo[elelocation - 2];
    document.getElementById('elementdescription').innerHTML = "Element Description: " + elementinfo[elelocation - 1];

    if (EleNum > 1) {
        document.getElementById('prev').innerHTML = "Previous Element (" + elementinfo[(elementnum - 1) * 17 - 16] + ")";
    } else {
        document.getElementById('prev').innerHTML = "";
    }

    if (EleNum < 118) {
        document.getElementById('next').innerHTML = "Next Element (" + elementinfo[(elementnum + 1) * 17 - 16] + ")";
    } else {
        document.getElementById('next').innerHTML = "";
    }

    //Website Links
    document.getElementById('webelements').href = "http://www.webelements.com/" + (elementinfo[elelocation - 16]).toLowerCase();
    document.getElementById('chemicool').href = "http://www.chemicool.com/elements/" + (elementinfo[elelocation - 16]).toLowerCase();
    document.getElementById('rsc').href = "http://www.rsc.org/periodic-table/element/" + (elementinfo[elelocation - 15]);
    var formattnum = ("00" + elementinfo[elelocation - 15]).slice(-3);
    document.getElementById('jlab').href = "http://education.jlab.org/itselemental/ele" + formattnum + ".html";
    document.getElementById('photographic').href = "http://periodictable.com/Elements/" + formattnum;
}

function exitinfopage() //Exit Info Page
{
    if ((smallsite == true) || (mobilesite == true)) {} else {
        move(document.getElementById('infocontainer'))
            .set('margin-left', '-9999px')
            .duration('1s')
            .ease('in-out')
            .end();

        infopageactivated = false;

        move(document.getElementById('ptablecontainer'))
            .set('opacity', '1')
            .duration('.5s')
            .ease('in-out')
            .end();

        document.getElementById('infocontainer').style.height = 0;
    }

}

function changeclick(changetype) //Change Element HView on KeyPress/Click
{
    if (changetype == 'prev') {
        if (CurrentHElement > 1) {
            horizontalchange(CurrentHElement - 1, false);
        }
    } else if (changetype = 'next') {
        if (CurrentHElement < 118) {
            horizontalchange(CurrentHElement + 1, false);
        }
    }
}

function horizontalchange(elenum, first) //HView Change(Move) Element
{
    hviewactivated = true;
    var elements = document.querySelectorAll(".element");

    var locx = 0;
    locy = 0;
    scalex = 1;
    scaley = 1;
    //Normal Scaling for Bottom Row, 3x Scaling for Displayed Element

    CurrentHElement = elenum;
    locx = CurrentHElement * -61; //Element Placement

    var animatetime = "0.1s";

    for (var i = 0; i < elements.length; i++) {

        locx = locx + 60;
        scalex = 1;
        scaley = 1;
        locy = 100;

        if (i + 1 == elenum) {
            //locx = 0;
            locy = -100;
            scalex = 3;
            scaley = 3;
            animatetime = "0.5s";
        }

        if (first == true) //Activate - Horizontal
        {
            animatetime = '2s';
        }

        move(elements[i])
            .setVendorProperty('transform', 'translate3d(' + locx + 'px,' + locy + 'px,0) scale(' + scalex + ',' + scaley + ')')
            .duration(animatetime)
            .ease('in-out')
            .end();

    }

    CurrentHElement = elenum;

    //Load Description/Prev/Next for Horizontal View
    var elelocation = elenum * 17;
    if (elementinfo[elelocation - 1] == '') {
        document.getElementById('eledesinfo').innerHTML = 'Element Description not Done Yet.';
    } else {
        document.getElementById('eledesinfo').innerHTML = elementinfo[elelocation - 1];
    }

    if (elenum > 1) {
        document.getElementById('hprev').innerHTML = "Previous Element (" + elementinfo[elelocation - 16 - 17] + ")";
    } else {
        document.getElementById('hprev').innerHTML = "";
    }

    if (elenum < 118) {
        document.getElementById('hnext').innerHTML = "Next Element (" + elementinfo[elelocation - 16 + 17] + ")";
    } else {
        document.getElementById('hnext').innerHTML = "";
    }
}

function elementchange(changetype) //HView Change Element
{
    if (changetype == 'prev') {
        if (EleNum > 1) {
            elementpage(EleNum - 1);
        }
    } else if (changetype = 'next') {
        if (EleNum < 118) {
            elementpage(EleNum + 1);
        }
    }
}

function formbtnclick() //Clicking, Clicking, Lots of Clicking
{
    document.getElementById('tableform').onclick = function () {
        periodictable("3s", 2);
    }
    document.getElementById('movingform').onclick = function () {
        periodictable("5s", 0);
    }
    document.getElementById('horizontalform').onclick = function () {
        periodictable("3s", 1);
    }
    document.getElementById('closewindow').onclick = function () {
        exitinfopage();
    }
    document.getElementById('next').onclick = function () {
        elementchange('next');
    }
    document.getElementById('prev').onclick = function () {
        elementchange('prev');
    }
    document.getElementById('hprev').onclick = function () {
        changeclick('prev');
    }
    document.getElementById('hnext').onclick = function () {
        changeclick('next');
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") { //Wait for DOM
        if (navigator.userAgent.match(/iPhone/i) || (navigator.userAgent.match(/iPod/i))) { //Activate Mobile View on Device Detection
            mobilesite = true;
            var style = document.createElement('link');
            style.type = 'text/css';
            style.href = 'assets/mobile.css';
            style.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].appendChild(style);
            elementpage(1); //Activate Hydrogen for Bottom
        }

        formbtnclick(); //Activate func

        //Handles Element Click / Description
        var elements = document.querySelectorAll(".element")
        for (var i = 0; i < elements.length; i++) {
            function clickElement(num) {
                (elements[i]).onclick = function () {
                    elementpage(num + 1);
                }
            }
            clickElement(i);
        }

        if (mobilesite == false) {
            JScale(); //Scale Page
        } else {
            scalefinish = true;
        }

        if ((smallsite == false) && (mobilesite == false)) { //Animate in if not Small/Mobile
            periodictable("0s", 0.5);
            periodictable(animatetime, 2);
        }
        
        
    }
}

window.onresize = function () {
    JScale(); //Scale Table to Fit
}

function JScale() //For Scaling of Table
{
    //document.title = window.innerWidth;
    if (window.innerWidth <= 480) { //Less than 480px
        if (scalefinish == false) {
            //window.clearInteval('TimerMove');
            periodictable('0s', 2);
            exitinfopage();

            // Reset Info Container if Open
            document.getElementById('infocontainer').removeAttribute('style');
            document.getElementById('infocontainer').style.opacity = 0;

            smallsite = true;
            // Reset Transforms
            document.getElementById('ptablecontainer').removeAttribute('style');

            if ((document.getElementById('H').style.Transform != "")) {
                var element = document.querySelectorAll('.element');
                for (var i = 0; i < element.length; i++) {
                    element[i].removeAttribute('style');
                }
            }

            elementpage(1);
            scalefinish = true;
        }
    } else {
        scalefinish = false;
        screenheight = window.innerHeight;
        screenwidth = window.innerWidth;

        var screenh = 720;
        var screenw = 1320;

        var screenscaleh = screenheight / screenh;
        var screenscalew = screenwidth / screenw;

        var screenaspect; //Take the Smallest Scale

        if (screenscaleh > screenscalew) {
            screenaspect = screenscalew;
        } else {
            screenaspect = screenscaleh;
        }

        screenaspect = Math.round(screenaspect * 100) / 100;

        var changescale = document.getElementById('ptablecontainer');

        //Perhaps use Vendor Prefix Detection - Future, Scale Container
        var scalestyle = 'scale(' + screenaspect + ',' + screenaspect + ')'
        changescale.style.webkitTransform = scalestyle;
        changescale.style.Transform = scalestyle;
        changescale.style.MozTransform = scalestyle;
        changescale.style.msTransform = scalestyle;
        scaleTransform = scalestyle;

        if (smallsite == true) {
            periodictable("0s", 0.5);
            periodictable(animatetime, 2);
            smallsite = false;
        }
        
        move(document.getElementById('ptablecontainer'))
        .setProperty('opacity', '1')
        .duration('1s')
        .ease('in-out')
        .end();
    }
}
window.onorientationchange = function () {
    JScale();
} // For Tablet Devices
window.onkeydown = function (e) {
    if (navigator.userAgent.match('Mozilla')) { //alert(e.keyCode);
        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 33 || e.keyCode == 34) { //Arrow Keys
            if (smallsite == false) //To Enable Scrolling when Mobile or Small
            {
                e.preventDefault();
            }
        }
    }
    if (infopageactivated == true) {
        if (e.keyCode == 27) { //ESC
            exitinfopage(); //Info Page Exit
        } else if (e.keyCode == 39) { //Right
            if (EleNum < 118) {
                elementpage(EleNum + 1); //Next Element
            }
        } else if (e.keyCode == 37) { //Left
            if (EleNum > 1) {
                elementpage(EleNum - 1); //Prev Element
            }
        }
    }
    if (hviewactivated == true) //HView Prev/Next
    {
        if (infopageactivated == false) {
            if (e.keyCode == 39) {
                changeclick('next');
            } else if (e.keyCode == 37) {
                changeclick('prev');
            }
        }
    }
}
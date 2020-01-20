/*global document, console, window, elementinfo*/
/*jslint browser:true, vars:true, plusplus: true*/

// Defines a 3D coordinate
var Point = function (x, y, z) {
    "use strict";
    this.x = x;
    this.y = y;
    this.z = z;
};

// Table Element (Data, State)
var TableElement = function (info) {
    "use strict";
    // Element Information
    this.Name = info.Name;
    this.Symbol = info.Symbol;
    this.Mass = info.Mass;
    this.Number = info['Atomic Number'];
    this.Classification = info.Classification;
    this.Group = info.Group;
    this.Period = info.Period;
    this.Location = info.Location;
    this.Shellconfiguration = info['Electron shell configuration'];
    this.Subshellconfiguration = info['Electron subshell configuration'];
    this.Ionenergy = info['Ionisation energy'];
    this.Roomstate = info['State at Room Temperature'];
    this.Boiling = info['Boiling Point'];
    this.Melting = info['Melting Point'];
    this.Isotopes = info.Isotopes;
    this.Discovered = info.Discovered;
    this.Description = info['Element Description'];

    // Calculate Table Locations
    var locx = -(35 + 60 * 9) + this.Group * 60;
    var locy = -(10 + 5 * 70) + this.Period * 70;
    var locz = 0;
    if (this.Number >= 56 + 1 && this.Number < 71 + 1) {
        locx = -(35 + 60 * 10) + (this.Number - 52) * 60;
        locy = -(10 + 5 * 70) + 8.3 * 70;
    }
    if (this.Number >= 88 + 1 && this.Number < 103 + 1) {
        locx = -(35 + 60 * 10) + (this.Number - 84) * 60;
        locy = -(10 + 5 * 70) + 9.3 * 70;
    }

    // Locations for Table Form
    this.TableLocation = new Point(locx, locy, 0);

    // Random
    locx = Math.floor(Math.random() * window.innerWidth - window.innerWidth / 2);
    locy = Math.floor(Math.random() * window.innerHeight - window.innerHeight / 2);
    locz = 0; // For perspective problems
    this.randomLocation = new Point(locx, locy, locz);
};
TableElement.prototype.generateNewRandomPosition = function () {
    "use strict";
    // Randomise and change position
    var r = Math.floor((Math.random() * 3) + 1);
    if (r === 1) {
        // Change X
        this.randomLocation.x = Math.floor(Math.random() * window.innerWidth - window.innerWidth / 2);
    } else if (r === 2) {
        // Change Y
        this.randomLocation.y = Math.floor(Math.random() * window.innerHeight - window.innerHeight / 2);
    } else if (r === 3) {
        // Change Z
        this.randomLocation.z = Math.floor(Math.random() * window.innerHeight * 2 - window.innerHeight / 2 * 2);
    }
};

// App
var App = function () {
    "use strict";
    // Elements
    this.elementArray = [];
    this.elements = document.querySelectorAll('.element');

    // Status
    this.currentInfoPageElementNumber = 1;
    this.currentHorizontalElementNumber = 1;
    this.currentView = "table";
    this.infoPageActivated = false;
    this.timerMove = null;
    this.initFinished = false;

    // Min. Width or Mobile
    this.smallMode = false;

    // Create new Element Objects
    var i;
    for (i = 0; i < 118; i++) {
        this.elementArray.push(new TableElement(elementinfo[i]));
    }

    // Element Clicks
    var elements = document.querySelectorAll(".element");
    for (i = 0; i < elements.length; i++) {
        this.linkInfo(elements[i], i + 1);
    }

    // Prev/Next Buttons
    this.initprevnext();
    this.initHorizontal();
    this.initViewButtons();
    this.initKey();

    // Resize
    var self = this;
    // Scale Table to Fit
    window.onresize = function () {
        self.resizePage();
    };
    // For Tablet Devices
    window.onorientationchange = function () {
        self.resizePage();
    };
};
// Returns element by number - e.g. 1 will return Hydrogen
App.prototype.getElement = function (elementNumber) {
    "use strict";
    return this.elementArray[elementNumber - 1];
};
// When user clicks on an element
App.prototype.linkInfo = function (element, number) {
    "use strict";
    var self = this;
    element.onclick = function () {
        if (self.currentView === "horizontal" && self.currentHorizontalElementNumber !== number) {
            self.Horizontal(number, false);
            return;
        }
        self.loadInfoPage(number, true);
    };
};
// View Buttons
App.prototype.initViewButtons = function () {
    "use strict";
    var self = this;
    // Table Form
    document.getElementById('tableform').onclick = function () {
        if (self.currentView === "horizontal") {
            document.getElementById('eledes').className = "hidebottompane";
        } else if (self.currentView === "random") {
            window.clearInterval(self.timerMove);
        }
        self.Table();
        window.setTimeout(function () {document.getElementById('ptablecontainer').className = "show"; }, 2000);
    };
    // Random Form
    document.getElementById('movingform').onclick = function () {
        if (self.currentView === "horizontal") {
            document.getElementById('eledes').className = "hidebottompane";
        }
        self.Random();
    };
    // Horizontal Form
    document.getElementById('horizontalform').onclick = function () {
        if (self.currentView === "random") {
            window.clearInterval(self.timerMove);
        }
        self.Horizontal(1, true);
        window.setTimeout(function () {document.getElementById('ptablecontainer').className = "show"; }, 2000);
    };
};
// Prev/Next Buttons
App.prototype.initprevnext = function () {
    "use strict";
    var load = this.loadInfoPage.bind(this);
    var self = this;
    document.getElementById('prev').onclick = function () {
        load(self.currentInfoPageElementNumber - 1);
    };
    document.getElementById('next').onclick = function () {
        load(self.currentInfoPageElementNumber + 1);
    };
    document.getElementById('closewindow').onclick = function () {
        document.getElementById('ptablecontainer').className = "show";
        document.getElementById('infocontainer').style.marginLeft = '-9999px';
        self.infoPageActivated = false;
    };
};
// Horizontal Prev/Next
App.prototype.initHorizontal = function () {
    "use strict";
    var self = this;
    document.getElementById('hprev').onclick = function () {
        self.Horizontal(self.currentHorizontalElementNumber - 1, false);
    };
    document.getElementById('hnext').onclick = function () {
        self.Horizontal(self.currentHorizontalElementNumber + 1, false);
    };
};
// Init Intro - Elements Fly In
App.prototype.initIntro = function () {
    "use strict";
    // Do not transform on small mode
    if (this.smallMode) {
        return;
    }
    // Assign random locations for each element
    var i, locx, locy, locz;
    for (i = 0; i < this.elements.length; i++) {
        locx = (Math.floor(Math.random() * 9999 - 9999 / 2));
        locy = (Math.floor(Math.random() * 9999 - 9999 / 2));
        locz = (Math.floor(Math.random() * 9999 * 2 - 9999 / 2 * 2));
        this.elements[i].style.transform = 'translate3d(' + locx + 'px,' + locy + 'px,' + locz + 'px)';
        this.elements[i].style.transitionDuration = '0s';
    }

    // this.elements[117].addEventListener("transitionend", this.Intro(), true);
    var self = this;
    window.setTimeout(function () {self.Table('5s'); }, 20);
    window.setTimeout(function () {self.initFinished = true; }, 5000);
};
App.prototype.Random = function (time) {
    "use strict";
    time = time || '5s';
    if (this.initFinished === false) {
        return;
    }
    if (this.currentView !== 'random') {
        this.currentView = 'random';
    }
    // Perpective for z
    document.getElementById('ptablecontainer').className = "show perspective";
    // Loop
    var self = this;
    window.clearInterval(this.timerMove);
    this.timerMove = window.setTimeout(function () {self.Random(); }, 5000);
    // Transform to determined random Locations
    var i, elementposition;
    for (i = 0; i < this.elements.length; i++) {
        this.elementArray[i].generateNewRandomPosition();
        elementposition = this.elementArray[i].randomLocation;
        this.elements[i].style.transform = 'translate3d(' + elementposition.x + 'px,' + elementposition.y + 'px,' + elementposition.z + 'px)';
        this.elements[i].style.transitionDuration = time;
    }
};
// Table
App.prototype.Table = function (time) {
    "use strict";
    // Default time of 2s
    time = time || '2s';
    // Update status to 'table'
    if (this.currentView !== "table") {
        this.currentView = "table";
    }
    this.currentView = 'random';
    // Transform to predetermined Table Locations
    var i, elementposition;
    for (i = 0; i < this.elements.length; i++) {
        elementposition = this.elementArray[i].TableLocation;
        this.elements[i].style.transform = 'translate3d(' + elementposition.x + 'px,' + elementposition.y + 'px,0)';
        this.elements[i].style.transitionDuration = time;
    }
};
// Horizontal
App.prototype.Horizontal = function (elementNumber, first) {
    "use strict";
    // Update Internal Number
    this.currentView = "horizontal";
    this.currentHorizontalElementNumber = elementNumber;
    if (first) {
        document.getElementById('eledes').className = "showbottompane";
    }

    // Get list of elements
    var elements = this.elements;
    // Locations / Animation Time
    var locx = elementNumber * -61, locy = 100, scale = 1;
    var animatetime = "0.1s";

    // Update element positions
    var i;
    for (i = 0; i < elements.length; i++) {
        locx = locx + 60;

        // Currently Selected Element
        if (i + 1 === elementNumber) {
            // Move upwards, scale 3x, increase animation time
            locy = -100;
            scale = 3;
            animatetime = "0.5s";
        } else {
            scale = 1;
            locy = 100;
        }
        // Transform elements into place
        elements[i].style.transform = 'translate3d(' + locx + 'px,' + locy + 'px,0) scale(' + scale + ')';

        // On activation of Horizontal View
        if (first === true) {
            animatetime = '2s';
        }
        elements[i].style.transitionDuration = animatetime;
    }

    // Load Description
    if (this.getElement(elementNumber).Description === '') {
        document.getElementById('eledesinfo').innerHTML = 'Element description not done yet.';
    } else {
        document.getElementById('eledesinfo').innerHTML = this.getElement(elementNumber).Description;
    }

    // Load Prev/Next
    if (elementNumber > 1) {
        document.getElementById('hprev').innerHTML = "Previous Element (" + this.getElement(elementNumber - 1).Name + ")";
    } else {
        document.getElementById('hprev').innerHTML = "";
    }
    if (elementNumber < 118) {
        document.getElementById('hnext').innerHTML = "Next Element (" + this.getElement(elementNumber + 1).Name + ")";
    } else {
        document.getElementById('hnext').innerHTML = "";
    }
};
App.prototype.loadInfoPage = function (elementNumber, animateto) {
    "use strict";
    animateto = animateto || false;
    this.currentInfoPageElementNumber = elementNumber;
    // Activate / Show Info Page
    if (!this.infoPageActivated) {
        // Go back to table view
        if (this.currentView === 'random' && this.smallMode === false) {
            document.getElementById('ptablecontainer').className = "hide perspective";
            this.Table();
            window.clearInterval(this.timerMove);
        }
        if (!this.smallMode) {
            document.getElementById('ptablecontainer').className = "hide";
        }
        document.getElementById('infocontainer').style.marginLeft = '0px';
    }
    this.infoPageActivated = true;

    // Mobile Mode - Jump to Info Page - Rather than slide open
    if (this.smallMode) {
        document.getElementById('ptablecontainer').className = "show";
        document.getElementById('infocontainer').style.opacity = 0;
        document.getElementById('infocontainer').style.opacity = 1;
        if (animateto === true) {
            window.scrollTo(0, document.getElementById('infocontainer').offsetTop);
        }
    }

    // Update Info Page Values
    var element = this.getElement(elementNumber);
    document.getElementById('symbol-large').innerHTML = element.Symbol;
    document.getElementById('symbol').innerHTML = "Symbol: " + element.Symbol;
    document.getElementById('name').innerHTML = "Name: " + element.Name;
    document.getElementById('number').innerHTML = "Atomic Number: " + element.Number;
    document.getElementById('mass').innerHTML = "Mass: " + element.Mass;
    document.getElementById('classification').innerHTML = "Classification: " + element.Classification;
    document.getElementById('location').innerHTML = "Location: " + "Group " + element.Group + ", Period " + element.Period + ", " + element.Location;
    document.getElementById('shellconfig').innerHTML = "Electron Shell Configuration: " + element.Shellconfiguration;
    document.getElementById('subshellconfig').innerHTML = "Electron subshell configuration: " + element.Subshellconfiguration;
    document.getElementById('ionisation').innerHTML = "Ionisation energy: " + element.Ionenergy;
    document.getElementById('state').innerHTML = "State at Room Temperature: " + element.Roomstate;
    document.getElementById('boiling').innerHTML = "Boiling Point: " + element.Boiling;
    document.getElementById('melting').innerHTML = "Melting Point: " + element.Melting;
    document.getElementById('isotopes').innerHTML = "Isotopes: " + element.Isotopes;
    document.getElementById('discovery').innerHTML = "Discovered: " + element.Discovered;
    document.getElementById('description').innerHTML = "Element Description: " + element.Description;

    // Undefined Group/Mass
    if (element.Group === undefined || element.Group === null) {
        document.getElementById('location').innerHTML = "Location: " + "Group " + "None" + ", Period " + element.Period + ", " + element.Location;
    }
    if (element.Mass === undefined) {
        document.getElementById('mass').innerHTML = "Mass: ";
    }

    // Prev/Next
    if (element.Number > 1) {
        document.getElementById('prev').innerHTML = "Previous Element (" + this.getElement(element.Number - 1).Name + ")";
    } else {
        document.getElementById('prev').innerHTML = "";
    }
    if (element.Number < 118) {
        document.getElementById('next').innerHTML = "Next Element (" + this.getElement(element.Number + 1).Name + ")";
    } else {
        document.getElementById('next').innerHTML = "";
    }

    // Website Links
    document.getElementById('webelements').href = "http://www.webelements.com/" + element.Name.toLowerCase();
    document.getElementById('chemicool').href = "http://www.chemicool.com/elements/" + element.Name.toLowerCase();
    document.getElementById('rsc').href = "http://www.rsc.org/periodic-table/element/" + element.Number;
    var formattnum = ("00" + element.Number).slice(-3);
    document.getElementById('jlab').href = "http://education.jlab.org/itselemental/ele" + formattnum + ".html";
    document.getElementById('photographic').href = "http://periodictable.com/Elements/" + formattnum;
};
// Page Resize
App.prototype.resizePage = function () {
    "use strict";
    // For Scaling of Table
    var elements = document.querySelectorAll('.element');
    var i = 0;

    // Less than 480px
    if (window.innerWidth <= 480) {
        this.smallMode = true;

        // Clear Timers for Random Mode
        window.clearInterval(this.timerMove);

        // Exit/Reset Info Page
        document.getElementById('ptablecontainer').removeAttribute('style');
        document.getElementById('ptablecontainer').className = "show";
        document.getElementById('infocontainer').style.marginLeft = '0';
        document.getElementById('infocontainer').removeAttribute('style');
        document.getElementById('infocontainer').style.height = '100%';

        // Remove Transforms for Elements
        for (i = 0; i < elements.length; i++) {
            elements[i].removeAttribute('style');
            elements[i].style.transitionDuration = "0s";
        }

        // Exit horizontal mode (if applicable)
        if (this.currentView === 'horizontal') {
            this.currentView = "table";
            document.getElementById('eledes').className = "hidebottompane";
        }

        // Load the first element
        this.loadInfoPage(1);
    } else {
        // Get width/height of current window
        var screenheight = window.innerHeight, screenwidth = window.innerWidth;
        // Preset
        var screenh = 720, screenw = 1320;

        // Find the Smaller Aspect (Horizontal / Vertical)
        var screenscaleh = screenheight / screenh;
        var screenscalew = screenwidth / screenw;
        var screenaspect;
        if (screenscaleh > screenscalew) {
            screenaspect = screenscalew;
        } else {
            screenaspect = screenscaleh;
        }
        // Round to 2 decimal places
        screenaspect = Math.round(screenaspect * 100) / 100;

        // Hide Info container, show Table
        document.getElementById('infocontainer').removeAttribute('style');
        document.getElementById('infocontainer').style.marginLeft = '-9999px';
        document.getElementById('infocontainer').className = 'hide';
        if (document.getElementById('ptablecontainer').className.includes('show') === false) {
            document.getElementById('ptablecontainer').className = 'show';
        }
        this.infoPageActivated = false;

        // Scale Container
        // Perhaps use Vendor Prefix Detection/Zoom for Future
        var changescale = document.getElementById('ptablecontainer');
        var scalestyle = 'scale(' + screenaspect + ',' + screenaspect + ')';
        changescale.style.webkitTransform = scalestyle;
        changescale.style.Transform = scalestyle;
        changescale.style.MozTransform = scalestyle;
        changescale.style.msTransform = scalestyle;

        if (this.smallMode === true) {
            this.smallMode = false;
            this.initFinished = false;
            this.initIntro();
        }
    }
};
// Keyboard Navigation
App.prototype.initKey = function () {
    "use strict";
    var self = this;
    window.onkeydown = function (e) {
        // Info Page Element Navigation
        if (self.infoPageActivated === true) {
            if (e.keyCode === 27) {
                // ESC - Exit Info Page
                document.getElementById('infocontainer').style.marginLeft = '-9999px';
                document.getElementById('infocontainer').className = 'hide';
                document.getElementById('ptablecontainer').className = 'show';
                self.infoPageActivated = false;
            } else if (e.keyCode === 39 && self.currentInfoPageElementNumber < 118) {
                // Right - Next Element
                self.loadInfoPage(self.currentInfoPageElementNumber + 1);
            } else if (e.keyCode === 37 && self.currentInfoPageElementNumber > 1) {
                // Left - Prev Element
                self.loadInfoPage(self.currentInfoPageElementNumber - 1);
            }
        }
        if (self.currentView === 'horizontal' && self.infoPageActivated === false) {
            // Horizontal View Prev/Next
            if (e.keyCode === 39 && self.currentHorizontalElementNumber < 118) {
                self.Horizontal(self.currentHorizontalElementNumber + 1, false);
            } else if (e.keyCode === 37 && self.currentHorizontalElementNumber > 1) {
                self.Horizontal(self.currentHorizontalElementNumber - 1, false);
            }
        }
    };
};

document.onreadystatechange = function () {
    "use strict";
    // When page is loaded
    if (document.readyState === "complete") {
        // Init App
        var periodic = new App();
        // Activate Mobile View on Device Detection
        if (navigator.userAgent.match(/iPhone/i) || (navigator.userAgent.match(/iPod/i))) {
            // Add mobile stylesheet
            var style = document.createElement('link');
            style.type = 'text/css';
            style.href = 'assets/mobile.css';
            style.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].appendChild(style);
            periodic.smallMode = true;
            // Activate Hydrogen for Information Page
            periodic.loadInfoPage(1);
        } else {
            // Scale Page and Init Intro
            periodic.resizePage();
            periodic.initIntro();
        }
    }
};

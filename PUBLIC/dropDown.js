let menuDiv = document.getElementById('ruuviTags');
let currentRuuvi = menuDiv.children[0];
let menuBtn = menuDiv.children[1];
let ruuviList = menuDiv.children[2];

let infoDiv = document.getElementById('liveInfo');

let infoTitle = infoDiv.children[0];
let section1 = infoDiv.children[1];
let section2 = infoDiv.children[2];

let measurementsDiv = temperature.parent;

let collapsed = true;

menuDiv.addEventListener('click', (e) => {
    console.log(infoTitle);

    if (collapsed) {
        menuDiv.classList.remove('collapsed');
        menuDiv.classList.add('active')

        infoDiv.classList.add('collapsed');
        infoDiv.classList.remove('active');

        infoTitle.classList.add('collapsed');
        infoTitle.classList.remove('active');

        section1.classList.add('collapsed');
        section1.classList.remove('active');

        section2.classList.add('collapsed');
        section2.classList.remove('active');

        menuBtn.classList.remove('collapsed');
        menuBtn.classList.add('active');

        collapsed = false;
    } else {
        menuDiv.classList.add('collapsed');
        menuDiv.classList.remove('active')

        infoDiv.classList.remove('collapsed');
        infoDiv.classList.add('active');

        infoTitle.classList.remove('collapsed');
        infoTitle.classList.add('active');

        section1.classList.remove('collapsed');
        section1.classList.add('active');

        section2.classList.remove('collapsed');
        section2.classList.add('active');

        menuBtn.classList.add('collapsed');
        menuBtn.classList.remove('active');

        collapsed = true;
    }
})


function updateDropDown() {
    ruuviList.innerHTML = "";
    ruuviTags.forEach((tag) => {
        console.log('updateDropDown');
        console.log(current);
        if (`${tag}` !== currentTag) {
            let elem = document.createElement('li');
            elem.className = "selection";
            elem.id = tag;
    
            elem.innerHTML = `#${tag}`;
    
            ruuviList.appendChild(elem);

            elem.addEventListener('click', () => {
                console.log(elem);
                currentTag = elem.id;
                updateData();

                console.log(current);

                currentRuuvi.innerHTML = `Current: #${elem.id}`;
            })
        }
    })
};
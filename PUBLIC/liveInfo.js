class dataElem {
    constructor(element, prefix, min, max, startColor, endColor) {
        this.parent = element;
        this.background = element.children[1];
        this.value = element.children[1].children[0].children[0];
        this.title = element.children[0]
        this.prefix = prefix;
        this.range = {
            min: min,
            max: max
        };
        this.startColor = startColor;
        this.endColor = endColor;
    }

    setValue(value) {
        this.value.innerHTML = value + this.prefix;
        
        let percent = (value - this.range.min) / (this.range.max - this.range.min);
        let colorDiff = [this.endColor[0] - this.startColor[0], this.endColor[1] - this.startColor[1], this.endColor[2] - this.startColor[2]];
        let color = [this.startColor[0] + colorDiff[0] * percent, this.startColor[1] + colorDiff[1] * percent, this.startColor[2] + colorDiff[2] * percent];
        
        this.setBackground(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }

    setBackground(color) {
        //this.title.style.color = color;
        this.background.style.background = color;
        this.value.style.color = color;
    }
}

const liveInfo = document.getElementById('liveInfo');
const temperature = new dataElem(liveInfo.children[1].children[0].children[0], '°C', -60, 60, [71, 96, 255], [255, 45, 36]);
const humidity = new dataElem(liveInfo.children[1].children[0].children[1], '%', -1, 1, [10, 36, 99], [10, 36, 99]);
const pressure = new dataElem(liveInfo.children[2].children[0].children[0], 'bar', -1, 1, [10, 36, 99], [10, 36, 99]);
const acceleration = new dataElem(liveInfo.children[2].children[0].children[1], '', -1, 1, [10, 36, 99], [10, 36, 99]);

console.log(temperature);

temperature.setValue('-50');

String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

function getWidth() {
    return Math.min(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
  
function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

const elem = document.querySelector('textarea.edit');
const fileopen = document.querySelector('input.fileopen');
const filename = document.querySelector('input.filename');

function resize() {
    elem.setAttribute('style', '');
    elem.setAttribute('style', ['width: ', getWidth()-40, 'px; height: ', getHeight()-82, 'px'].join(''));
}

function filediag(textToWrite, fileNameToSaveAs) {
    var blobba = new Blob([textToWrite], {type: lookup(fileNameToSaveAs) || 'text/plain'});
    var link = document.createElement("a");
    //console.log(fileNameToSaveAs.indexOf("."));
    if (fileNameToSaveAs.indexOf(".") === -1) {
        fileNameToSaveAs = [fileNameToSaveAs, ".txt"].join('');
    };
    link.download = fileNameToSaveAs;
    link.innerHTML = "Download File";
    if (window.link != null) {
        link.href = window.webkitURL.createObjectURL(blobba);
    } else if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobba, fileNameToSaveAs);
    } else {
        link.href = window.URL.createObjectURL(blobba);
        link.onclick = function(event) {
            document.body.removeChild(event.target);
        }
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}

function getfname() {
    if (!(filename.value == '')) {
        return filename.value;
    } else {
        return prompt("Please name the file", "*");
    }
}

document.onkeydown = function (e) {
    const ctrl = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    if (e.keyCode == 83 && ctrl) {
        e.preventDefault();
        filediag(elem.value, getfname());
    } else if (e.keyCode == 79 && ctrl) {
        e.preventDefault();
        fileopen.click();
    } else if (e.keyCode == 78 && ctrl && e.altKey) {
        e.preventDefault();
        window.open(location.href);
    }
}

// https://stackoverflow.com/a/68589305
fileopen.addEventListener('change', function() {
    var GetFile = new FileReader();
    GetFile.onload=function(){
        elem.value = GetFile.result;
    }
    GetFile.readAsText(this.files[0]);
});

elem.addEventListener('change', function() {
    undoable.setValue(elem.value);
});

window.onbeforeunload = function() {
    if (elem.value !== "") {
        return "Changes you made may not be saved.";
    }
}

document.querySelector("img#new").addEventListener("mouseup", function() {
    window.open(location.href);
});

document.querySelector("img#save").addEventListener("mouseup", function() {
    filediag(elem.value, getfname());
});

document.querySelector("img#undo").addEventListener("mouseup", function() {
    document.execCommand("undo");
});

document.querySelector("img#redo").addEventListener("mouseup", function() {
    document.execCommand("redo");
});

console.log('%c📄 Ctrl+O to open a file\n💾 Ctrl+S to save a file', 'font-size: x-large; font-family: cursor, monospace; font-weight: bold;')
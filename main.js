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

function resize() {
    elem.setAttribute('style', '');
    elem.setAttribute('style', ['width: ', getWidth(), 'px; height: ', getHeight()-16, 'px'].join(''));
}

function filediag(textToWrite, fileNameToSaveAs) {
    var blobba = new Blob([textToWrite], {type: lookup(fileNameToSaveAs) || 'text/plain'});
    var link = document.createElement("a");
    console.log(fileNameToSaveAs.indexOf("."));
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
        link.onclick = destroyClickedElement;
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

document.onkeydown = function (e) {
    const ctrl = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    if (e.keyCode == 83 && ctrl) {
        e.preventDefault();
        filediag(elem.value, window.prompt("Please name the file", "*"));
    } else if (e.keyCode == 79 && ctrl) {
        e.preventDefault();
        fileopen.click();
    } else if (e.keyCode == 78 && ctrl) {
        e.preventDefault();
        window.open(location.href, '_blank');
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

window.onbeforeunload = function() {
    if (elem.value !== "") {
        return "Changes you made may not be saved.";
    }
}

console.log('Ctrl+O to open a file\nCtrl+S to save a file')
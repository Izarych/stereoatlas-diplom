function addModels() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = '.obj';
    input.onchange = async function(event) {
        const files = event.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('models', files[i]);
        }
        const response = await fetch('http://localhost:5000', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
    };
    input.click();
}

function addMtl() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.mtl';
    input.onchange = async function (event) {
        const files = event.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('mtl', files[i]);
        }
        const response = await fetch('http://localhost:5000/mtl', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
    };
    input.click();
}

function addTextures() {
    const modelInput = document.getElementById('input-model').value;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async function (event) {
        const files = event.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        const response = await fetch(`http://localhost:5000/${modelInput}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
    };
    input.click();
}
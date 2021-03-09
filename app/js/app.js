const yt_download = require("ytdl-core");
const fs = require("fs");
const {dialog} = require('electron').remote;
const path_name = require('path');

// VARIAVEIS GLOBAIS
var format;
var path;

// SELECIONANDO A OPÇÃO DE FORMATO
document.querySelector(".format").addEventListener("change", () => {
    let img = document.querySelector("#format_icon");
    let item = document.querySelector(".format").value;
    switch (item) {
        case "error":
            img.src = "../img/question-mark-24.png";
            format = item;
            break;
    
        case ".mp4":
            img.src = "../img/film-2-24.png";
            format = item;
            break;

        case ".mp3":
            img.src = "../img/note-24.png";
            format = item;
            break;
    }
})

// BOTAO DE DOWNLOAD
document.querySelector("#btn_download").onclick = () => {
    let url = document.querySelector("#video_url").value;

    if(url && format != "error"){
        Download(url, format);
    }else {
        document.querySelector(".mensage_error").style.zIndex = "999";
    }
    
}

// FUNÇÃO QUE REALIZA O DOWNLOAD
async function Download (url, format){
    var percent_box = document.querySelector(".download_percent")
    percent_box.style.zIndex = "999";
    var id = await yt_download.getVideoID(url);
    var info = await yt_download.getInfo(id);
    
    if(format == ".mp3"){
        let output = path_name.resolve(path, `${info.videoDetails.title}${format}`);
        await yt_download(url, { quality: 'highestaudio' })
        .on("progress",(chucklength,downloaded,total) => {
            let download_size = downloaded/total;
            if(download_size == 1){
                percent_box.style.zIndex = "-999";
                document.querySelector("#video_url").value = "";
                document.querySelector("#title_info").innerHTML = info.videoDetails.title;
                document.querySelector("#format_info").innerHTML = format;
                document.querySelector("#date_info").innerHTML = info.videoDetails.uploadDate;
                document.querySelector("#url_info").innerHTML = info.videoDetails.video_url;
                document.querySelector("#description_info").innerHTML = info.videoDetails.description;
            }
        })
        .pipe(fs.createWriteStream(output));
      
    }else{
        let output = path_name.resolve(path, `${info.videoDetails.title}${format}`);
        await yt_download(url)
        .on("progress",(chucklength,downloaded,total) => {
            let download_size = downloaded/total;
            if(download_size == 1){
                percent_box.style.zIndex = "-999";
                document.querySelector("#video_url").value = "";
                document.querySelector("#title_info").innerHTML = info.videoDetails.title;
                document.querySelector("#format_info").innerHTML = format;
                document.querySelector("#date_info").innerHTML = info.videoDetails.uploadDate;
                document.querySelector("#url_info").innerHTML = info.videoDetails.video_url
                document.querySelector("#description_info").innerHTML = info.videoDetails.description;
            }
        })
        .pipe(fs.createWriteStream(output))
    }
}

// FUNÇÃO QUE FECHA O MODAL DE ALERTA
document.querySelector(".mensage_ok").onclick = () => {
    document.querySelector(".mensage_error").style.zIndex = "-999";
}


// FUNÇÃO QUE SELECIONA UMA PASTA
document.querySelector(".select_folder").onclick = () => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(element => {
        document.querySelector(".path_input").value = element.filePaths[0];
        path = element.filePaths[0];
    })
}
const video = document.getElementById('video')

exports.start = () => {
    // recuperar la info de la camara de la página
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia
    );

    console.log(navigator.getUserMedia())
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        er => console.log(er)
    )
}

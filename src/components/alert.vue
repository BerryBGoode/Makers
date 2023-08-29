<script>
import Swal from 'sweetalert2';

/**
 * Método para generar alerta de tipo information
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const alertInfo = (txt, button, time) => {
    let options = {
        background: '#1B1716',
        position: 'center',
        title: txt,
        icon: 'info',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',

        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',
    };
    (time) ? options.timer = time : options.timer = null;
    return Swal.fire(options)

}
/**
 * Método para generar mensaje de tipo information
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const notificationInfo = (txt, time, button) => {
    return Swal.fire({
        toast: true,
        background: '#1B1716',
        position: 'top-right',
        timerProgressBar: true,
        title: txt,
        icon: 'info',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',

    })

}
/**
 * Método para generar mensaje de tipo error
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const notificationError = (txt, time) => {
    return Swal.fire({
        toast: true,
        background: '#1B1716',
        position: 'top-right',
        timerProgressBar: true,
        title: txt,
        icon: 'error',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: 'Aceptar',
        iconColor: '#767676',
        confirmButtonColor: '#393534',
    })
}
/**
 * Método para generar mensaje de tipo exitosa
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const notificationSuccess = (txt, time, button) => {
    return Swal.fire({
        toast: true,
        background: '#1B1716',
        position: 'top-right',
        timerProgressBar: true,
        title: txt,
        icon: 'success',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',
    })
}
/**
 * Método para generar mensaje de tipo advertencia
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const notificationWarning = (txt, time, button) => {
    return Swal.fire({
        toast: true,
        background: '#1B1716',
        position: 'top-right',
        timerProgressBar: true,
        title: txt,
        icon: 'warning',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',
    })
}
/**
 * Método para generar mensaje de tipo pregunta
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const alertQuestion = (txt, time, button, deny = null, txtdeny = null, cancel = null) => {
    if (!time) {
        time = null;
    }
    return Swal.fire({
        toast: false,
        background: '#1B1716',
        position: 'center',
        timerProgressBar: true,
        title: txt,
        showCancelButton: cancel,
        cancelButtonText: 'Cancelar',
        showDenyButton: deny,
        denyButtonText: txtdeny,
        cancelButtonColor: 'Cancelar',
        icon: 'question',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',
        denyButtonColor: '#393534',
        // verificar sí se confirma el mensaje
    }).then((res) => {
        // retornar el resultado de la pregunta
        return res.isConfirmed
    })

}
/**
 * Método para generar mensaje de tipo pregunta
 * @param {*} txt texto del mensaje
 * @param {*} time tiempo de duración en milisegundos de la notificación
 * @param {*} button texto del botton
 */
export const notificationQuestion = (txt, time, button, deny = null, txtdeny = null) => {
    if (!time) {
        time = null;
    }
    return Swal.fire({
        toast: true,
        background: '#1B1716',
        position: 'top-right',
        timerProgressBar: true,
        title: txt,
        showCancelButton: true,
        showDenyButton: deny,
        denyButtonText: txtdeny,
        cancelButtonColor: 'Cancelar',
        icon: 'question',
        // text: 'dxd',
        color: '#fff',
        width: '25vw',
        timer: time,
        confirmButtonText: button,
        iconColor: '#767676',
        confirmButtonColor: '#393534',
        // verificar sí se confirma el mensaje
    }).then((res) => {
        // retornar el resultado de la pregunta
        return res.isConfirmed
    })

}
</script>
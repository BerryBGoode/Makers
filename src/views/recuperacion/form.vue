<style scoped>
.p-top-bottom {
    padding-top: 5vh;
    padding-bottom: 5vh;
}
</style>
<script>
import Swal from 'sweetalert2';
import logo from '../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';
// options api

export const alertRequest = (request, html) => {
    return Swal.fire({
        title: 'Ingresa tus datos',
        showCancelButton: true,
        confirmButtonText: 'Verficar',
        showLoaderOnConfirm: true,
        html: html,
        background: '#1B1716',
        color: '#fff',
        iconColor: '#767676',
        confirmButtonColor: '#393534',
        preConfirm: request,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(res => {
        return res.isConfirmed;
    })
}
</script>
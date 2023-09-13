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

export const alertRequest = () => {
    Swal.fire({
        title: 'Ingresa tus datos',
        showCancelButton: true,
        confirmButtonText: 'Verficar',
        showLoaderOnConfirm: true,
        html: `
                <form class="container p-5 login-container h-100">
                    <div class="col h-100 flex wrap login">
                        <div class="row-6 p-3 w-100 form align-center">
                            <div class="children-form">
                                <div class="mb-3">
                                    <label for="dui" class="form-label">DUI</label>
                                    <input type="text" class="form-control" id="dui" required>
                                </div>
                                <div class="mb-3">
                                    <label for="correo" class="form-label">Correo</label>
                                    <input type="email" class="form-control" id="correo" required>
                                </div>
                                <div class="mb-3">
                                    <label for="alias" class="form-label">Alias</label>
                                    <input type="text" class="form-control" id="alias" maxlength="20" required>
                                </div>
                                <div class="mb-3">
                                    <label for="pin" class="form-label">PIN</label>
                                    <input type="password" class="form-control" id="pin" maxlength="15" minlength="10" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>`,
        background: '#1B1716',
        color: '#fff',
        iconColor: '#767676',
        confirmButtonColor: '#393534',
        preConfirm: (login) => {
            return fetch(`//api.github.com/users/${login}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `${result.value.login}'s avatar`,
                imageUrl: result.value.avatar_url
            })
        }
    })
}
</script>
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavController, IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  getEmailError() {
    if (this.email.hasError('required')) return 'El correo es obligatorio';
    if (this.email.hasError('email')) return 'Correo inválido';
    return '';
  }

  getPasswordError() {
    if (this.password.hasError('required')) return 'La contraseña es obligatoria';
    if (this.password.hasError('minlength')) return 'Mínimo 6 caracteres';
    return '';
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const auth = getAuth();

    try {
      this.isLoading = true;
      await signInWithEmailAndPassword(auth, email, password);

      await this.showToast('✅ Bienvenido a Imperio Gym');
      this.router.navigateByUrl('/home', { replaceUrl: true });

    } catch (error: any) {
      console.error('Login Error:', error);
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        message = '❌ No existe una cuenta con este correo';
      } else if (error.code === 'auth/wrong-password') {
        message = '⚠️ Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo inválido';
      }
      this.showToast(message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async showToast(message: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top',
      color,
    });
    await toast.present();
  }

  goToRegister() {
    this.router.navigate(['/pages/register']);
  }


async goToRecover() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Recuperar contraseña';
  alert.message = 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.';
  alert.inputs = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'ejemplo@correo.com',
    },
  ];
  alert.buttons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Enviar',
      handler: async (data: any) => {
        const email = (data.email || '').trim();
        if (!email) {
          this.showToast('⚠️ Ingresa un correo válido', 'warning');
          return;
        }

        try {
          const auth = getAuth();
          await sendPasswordResetEmail(auth, email);
          this.showToast(`📧 Enlace de recuperación enviado a ${email}`, 'success');
        } catch (error) {
          console.error('Error al enviar correo de recuperación:', error);
          this.showToast('❌ No se pudo enviar el correo. Verifica que esté registrado.', 'danger');
        }
      },
    },
  ];

  document.body.appendChild(alert);
  await alert.present();
}


  goBack() {
    this.navCtrl.back();
  }
}

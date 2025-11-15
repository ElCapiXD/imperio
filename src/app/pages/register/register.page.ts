import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.createForm();
  }

  private createForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      direccion: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get nombre() { return this.registerForm.get('nombre')!; }
  get dni() { return this.registerForm.get('dni')!; }
  get correo() { return this.registerForm.get('correo')!; }
  get telefono() { return this.registerForm.get('telefono')!; }
  get direccion() { return this.registerForm.get('direccion')!; }
  get password() { return this.registerForm.get('password')!; }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { correo, password, dni, nombre, telefono, direccion } = this.registerForm.value;
    const auth = getAuth();
    const db = getFirestore();

    try {
      // 🔹 Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;

      // 🔹 Guardar datos del usuario en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid, // 👈 Agregamos el UID explícitamente
        nombre,
        dni,
        correo,
        telefono,
        direccion,
        createdAt: new Date(),
      });

      // 🔹 Mensaje de éxito
      await this.showToast('✅ Registro exitoso', 2500);

      // 🔹 Redirigir al login después de 1 segundo
      setTimeout(() => {
        this.router.navigateByUrl('/pages/login', { replaceUrl: true });
      }, 1000);

    } catch (error: any) {
      console.error('Firebase Error:', error);
      let message = '❌ Error al registrar usuario';

      // 🔸 Manejo de errores comunes
      if (error.code === 'auth/email-already-in-use') {
        message = '❌ Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        message = '❌ El correo no es válido';
      } else if (error.code === 'auth/weak-password') {
        message = '⚠️ La contraseña debe tener al menos 6 caracteres';
      } else if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
        message = '🚫 No tienes permisos para guardar los datos. Revisa las reglas de Firestore.';
      }

      await this.showToast(message, 3000);
    }
  }

  async showToast(message: string, duration = 2000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color: message.includes('✅') ? 'success' : 'danger',
    });
    await toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  goToLogin() {
    this.router.navigateByUrl('/pages/login');
  }
}
